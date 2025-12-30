import { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { OrbitControls, Environment, CanvasTexture } from '@react-three/drei';
import * as THREE from 'three';

interface DiceRollProps {
  onRollComplete: (reward: { type: string; value: number | null; label: string; diceTotal: number }) => void;
}

// Helper to create textures for the dice faces
const createDiceTexture = (value: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (!context) return null;

    context.fillStyle = 'white';
    context.fillRect(0, 0, 128, 128);
    context.fillStyle = 'black';
    context.font = 'bold 60px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(value.toString(), 64, 64);
    
    return new CanvasTexture(canvas);
}

const Die = (props: any) => {
  const ref = useRef<any>();
  const [isSleeping, setIsSleeping] = useState(false);

  const textures = useMemo(() => [
    createDiceTexture(6), // right
    createDiceTexture(1), // left
    createDiceTexture(2), // top
    createDiceTexture(5), // bottom
    createDiceTexture(3), // front
    createDiceTexture(4), // back
  ], []);

  useFrame(() => {
    if (ref.current) {
        const isCurrentlySleeping = ref.current.isSleeping();
        if (isCurrentlySleeping && !isSleeping) {
            setIsSleeping(true);
            if (props.onSleep) {
                props.onSleep(ref.current);
            }
        } else if (!isCurrentlySleeping && isSleeping) {
            setIsSleeping(false);
        }
    }
  });

  const roll = () => {
    if (ref.current) {
        setIsSleeping(false);
        ref.current.wakeUp();
        ref.current.applyImpulse(
            {
                x: (Math.random() - 0.5) * 20,
                y: Math.random() * 10,
                z: (Math.random() - 0.5) * 20,
            },
            true
        );
        ref.current.applyTorqueImpulse(
            {
                x: (Math.random() - 0.5) * 20,
                y: (Math.random() - 0.5) * 20,
                z: (Math.random() - 0.5) * 20,
            },
            true
        );
    }
  };

  useEffect(() => {
    if (props.startRoll) {
      roll();
    }
  }, [props.startRoll]);

  return (
    <RigidBody {...props} ref={ref} colliders="cuboid" restitution={0.5} friction={0.5}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        {textures.map((texture, index) => (
            texture && <meshStandardMaterial key={index} map={texture} attach={`material-${index}`} />
        ))}
      </mesh>
    </RigidBody>
  );
};

const getUpwardFaceValue = (quaternion: THREE.Quaternion) => {
    const normals = [
        new THREE.Vector3(1, 0, 0), // 6
        new THREE.Vector3(-1, 0, 0),// 1
        new THREE.Vector3(0, 1, 0), // 2
        new THREE.Vector3(0, -1, 0),// 5
        new THREE.Vector3(0, 0, 1), // 3
        new THREE.Vector3(0, 0, -1),// 4
    ];
    const values = [6, 1, 2, 5, 3, 4];
    const worldUp = new THREE.Vector3(0, 1, 0);

    let maxDot = -Infinity;
    let upwardFaceValue = -1;

    normals.forEach((normal, index) => {
        const worldNormal = normal.clone().applyQuaternion(quaternion);
        const dot = worldNormal.dot(worldUp);
        if (dot > maxDot) {
            maxDot = dot;
            upwardFaceValue = values[index];
        }
    });

    return upwardFaceValue;
};


const DiceRoll = ({ onRollComplete }: DiceRollProps) => {
  const [rolling, setRolling] = useState(false);
  const [rolled, setRolled] = useState(false);
  const [startRoll, setStartRoll] = useState(false);
  
  const die1Ref = useRef<any>();
  const die2Ref = useRef<any>();

  const sleepingDice = useRef(new Set()).current;

  const handleDieSleep = (dieRef: any, id: number) => {
    sleepingDice.add(id);
    if (sleepingDice.size === 2) {
      // Both dice are sleeping, calculate result
      const val1 = getUpwardFaceValue(die1Ref.current.rotation());
      const val2 = getUpwardFaceValue(die2Ref.current.rotation());
      const total = val1 + val2;

      console.log(`Roll result: ${val1} + ${val2} = ${total}`);
      
      // Now call the backend to get the reward
      invokeRollFunction(total);
    }
  };

  const invokeRollFunction = async (diceTotal: number) => {
     const { data, error } = await supabase.functions.invoke('roll-dice', {
      method: 'POST',
      body: { diceTotal } // Pass total if needed, though backend should generate it
    });

    if (error) {
      toast({
        title: 'Error Rolling Dice',
        description: error.message,
        variant: 'destructive',
      });
      setRolling(false); // Let user try again
      return;
    }
    
    const { reward } = data;
    toast({
      title: 'You rolled a ' + data.diceTotal + '!',
      description: data.message || `You won: ${reward.label}`,
    });

    onRollComplete({ ...reward, diceTotal: data.diceTotal });
    setRolled(true);
    setRolling(false);
  }

  const handleRollClick = () => {
    sleepingDice.clear();
    setStartRoll(false); // Reset start roll
    setRolling(true);
    setTimeout(() => setStartRoll(true), 100); // Trigger roll in Die components
  };
  
  return (
    <div className="p-6 border rounded-lg text-center bg-muted/20">
      <h3 className="text-xl font-bold mb-2">Feeling Lucky?</h3>
      <p className="text-muted-foreground mb-4">Roll the dice to get an exclusive discount on your order!</p>
      
      <div className="h-48 w-full rounded-lg bg-gray-200">
        <Suspense fallback={<p>Loading 3D Scene...</p>}>
            <Canvas shadows camera={{ position: [0, 8, 8], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
            <Physics>
                <Die ref={die1Ref} position={[-2, 3, 0]} startRoll={startRoll} onSleep={(ref: any) => handleDieSleep(ref, 1)} />
                <Die ref={die2Ref} position={[2, 3, 0]} startRoll={startRoll} onSleep={(ref: any) => handleDieSleep(ref, 2)} />
                <CuboidCollider position={[0, -1, 0]} args={[20, 1, 20]} />
            </Physics>
            <OrbitControls enableZoom={false} enablePan={false} />
            <Environment preset="sunset" />
            </Canvas>
        </Suspense>
      </div>

      <Button
        onClick={handleRollClick}
        disabled={rolling || rolled}
        variant="gradient"
        size="lg"
        className="mt-4"
      >
        {rolling ? 'Rolling...' : (rolled ? 'Good Luck!' : 'Roll Dice to Get Discount')}
      </Button>
    </div>
  );
};

export default DiceRoll;

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { createNoise2D } from 'simplex-noise';

const Canvas = () => {
  var canvas: HTMLCanvasElement = document.getElementById('map');

  const { t } = useTranslation();
  const { toast } = useToast();

  // Simplex-Noise generation
  const noise2D = createNoise2D();
  console.log(noise2D(0, 0));
  console.log(noise2D(0, 1));
  console.log(noise2D(0, 2));
  console.log(noise2D(0, 3));
  console.log(noise2D(0, 4));

  var ctx = canvas.getContext('2d');
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'black';
  context.lineWidth = 1;

  return (
    <main className="relative z-10 mx-auto max-w-screen-xl">
      <div className="z-30 flex h-screen items-center justify-center">
        <Card className="bg-background text-black dark:text-white">
          <CardHeader>
            <CardTitle>Canvas</CardTitle>
            <CardDescription>Karte mit Perlin Noise</CardDescription>
          </CardHeader>
          <CardContent>
            <canvas
              id="map"
              width={400}
              height={400}
              className="border border-black bg-background-light dark:border-white dark:bg-background-dark"
            ></canvas>
          </CardContent>
          <CardFooter className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="seed">Seed</Label>
            <Input id="seed" type="text" value="Test" />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default Canvas;

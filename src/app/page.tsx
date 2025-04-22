import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Langchain Toy</h1>
      <Button variant="outline">기본 버튼</Button>
      <Button variant="secondary">보조 버튼</Button>
      <Button variant="ghost">ghost 버튼</Button>
      <Button variant="link">link 버튼</Button>
      <Button variant="destructive">destructive 버튼</Button>
    </div>
  );
}

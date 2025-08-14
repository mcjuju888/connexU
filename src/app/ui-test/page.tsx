import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UITest() {
  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">UI Test</h1>
      <Card>
        <CardContent className="p-4 space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="you@school.edu" />
          <Button className="w-full">Continue</Button>
        </CardContent>
      </Card>
    </main>
  );
}

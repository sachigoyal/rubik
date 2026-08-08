import { useQuery } from "@tanstack/react-query";
import { Button } from "@repo/ui/components/button";
import { useTRPC } from "./lib/trpc";

function App() {
  const trpc = useTRPC();
  const hello = useQuery(trpc.hello.queryOptions());

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      {hello.isLoading && <p className="text-muted-foreground">Loading...</p>}
      {hello.data && <p className="text-muted-foreground">{hello.data}</p>}
      <Button onClick={() => hello.refetch()}>Click me</Button>
    </div>
  );
}

export default App;

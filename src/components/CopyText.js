"use client"
import toast from "react-hot-toast";
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

function CopyText({ text}) {
  const router = useRouter();
  const handleCopy = async () => {
    try {
        const url = new URL(text);
        const pathParts = url.pathname.split('/');
        const id = pathParts[pathParts.length - 1];
        await navigator.clipboard.writeText(id);
        toast.success('Meeting ID copied to clipboard');
        router.push('/video-consultation');
    } catch (err) {
        toast.error('Failed to copy meeting ID');
    }
};

  return (
    <Button 
      type="button" 
      size="sm" 
      className="px-3"
      onClick={handleCopy}
    >
      <span className="sr-only">Copy</span>
      <Copy className="h-4 w-4" />
    </Button>
  );
}

export default CopyText;
import { useToast } from "@/src/components/ui/use-toast";

function ToastError({ msg }: { msg: string }) {
  const { toast } = useToast();
  return toast({
    title: msg,
  });
}

export default ToastError;

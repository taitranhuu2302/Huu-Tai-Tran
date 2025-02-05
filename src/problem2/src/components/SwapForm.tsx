import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeftRight } from "lucide-react";
import { useGetSwitchPrice } from "@/services/switch-price";
import { getTokenImage } from "@/lib/image";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const swapSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than 0",
    }),
  fromToken: z.string().min(1, "Please select a token"),
  toToken: z.string().min(1, "Please select a token"),
});

type SwapFormValues = z.infer<typeof swapSchema>;

const SwapForm = () => {
  const { data } = useGetSwitchPrice();
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<SwapFormValues>({
    resolver: zodResolver(swapSchema),
    mode: "onChange",
  });

  const fromToken = form.watch("fromToken");
  const toToken = form.watch("toToken");
  const amount = form.watch("amount");

  // Filter token options dynamically
  const fromListToken = useMemo(
    () => data?.filter((token) => token.currency !== toToken) || [],
    [toToken, data],
  );
  const toListToken = useMemo(
    () => data?.filter((token) => token.currency !== fromToken) || [],
    [fromToken, data],
  );

  const onSubmit = async (values: SwapFormValues) => {
    setLoading(true);
    setTimeout(() => {
      const fromPrice = data?.find(
        (token) => token.currency === fromToken,
      )?.price;
      const toPrice = data?.find((token) => token.currency === toToken)?.price;

      if (!fromPrice || !toPrice) {
        setLoading(false);
        return;
      }

      setConvertedAmount((parseFloat(values.amount) * fromPrice) / toPrice);
      setLoading(false);
    }, 1000);
  };

  const conversionResult = useMemo(() => {
    if (!convertedAmount || !fromToken || !toToken) return null;
    return (
      <div className="text-center mt-4 text-lg font-semibold text-gray-800">
        {`${Number(
          amount,
        ).toLocaleString()} ${fromToken} ≈ ${convertedAmount.toLocaleString(
          undefined,
          { minimumFractionDigits: 2 },
        )} ${toToken}`}
      </div>
    );
  }, [convertedAmount, amount, fromToken, toToken]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Currency Converter
        </h2>

        <div className="space-y-4">
          {/* Amount Input */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* From & To Tokens Selection */}
          <div className="grid grid-cols-3 gap-3">
            {/* From Token */}
            <FormField
              control={form.control}
              name="fromToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        {fromListToken?.map((token) => (
                          <SelectItem key={`from-token-${token.currency}`} value={token.currency}>
                            <div className="flex items-center gap-2">
                              <img
                                src={getTokenImage(token.currency)}
                                alt={token.currency}
                                className="w-5 h-5"
                              />
                              {token.currency}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-center mt-5">
              <ArrowLeftRight />
            </div>

            {/* To Token */}
            <FormField
              control={form.control}
              name="toToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        {toListToken?.map((token) => (
                          <SelectItem key={`to-token-${token.currency}`} value={token.currency}>
                            <div className="flex items-center gap-2">
                              <img
                                src={getTokenImage(token.currency)}
                                alt={token.currency}
                                className="w-5 h-5"
                              />
                              {token.currency}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !form.formState.isValid}
            className="w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading ? "Fetching Exchange Rate..." : "Get Exchange Rate"}
          </Button>

          {/* Display Conversion Result */}
          {conversionResult}
        </div>
      </form>
    </Form>
  );
};

export default SwapForm;

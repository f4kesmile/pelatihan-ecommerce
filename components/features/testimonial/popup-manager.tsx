import { createClient } from "@/lib/supabase/server";
import { getLatestEligibleOrder } from "@/server/actions/testimonial.actions";
import { ReviewPopup } from "./review-popup";

export async function PopupManager() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const latestOrder = await getLatestEligibleOrder(user.id);

  if (!latestOrder) return null;

  return (
    <ReviewPopup
      orderId={latestOrder.orderId}
      orderNumber={latestOrder.orderNumber}
      productName={latestOrder.productName}
      productImage={latestOrder.productImage}
    />
  );
}

import { getMyOrders } from "@/lib/orders";
import OrderCard from "./OrderCard";
import EmptyState from "./EmptyState";

export default async function OrderList() {
  const res = await getMyOrders();

  if (res.data.length === 0) {
    return (
      <EmptyState
        title="¡Aún no hay partidas guardadas! 💾"
        description="Cuando completes una compra aparecerá aquí, como un save file."
      />
    );
  }

  return (
    <div className="space-y-4">
      {res.data.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

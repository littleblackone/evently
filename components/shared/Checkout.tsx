"use client";

import { checkoutOrder, getOrdersByEvent } from "@/lib/actions/order.action";
import { IEvent } from "@/lib/database/models/event.model";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import { IOrder } from "@/lib/database/models/order.model";
loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout({
  event,
  userId,
}: {
  event: IEvent;
  userId: string;
}) {
  const [isBought, setIsBought] = useState<boolean | null>(null);

  const { user } = useUser();
  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId,
      imageUrl: event.imageUrl,
    };

    await checkoutOrder(order);
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }
    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
    //check the user if already bought the event
    const fetchOrdered = async () => {
      const ordereds = await getOrdersByEvent({
        searchString: "",
        eventId: event._id,
      });

      let found = false;

      ordereds.map((order: { buyer: string }) => {
        if (order.buyer === user?.fullName) {
          found = true;
        }
      });

      setIsBought(found);
    };
    fetchOrdered();
  }, [isBought, user]);

  return (
    <>
      {isBought === null ? null : isBought ? (
        <span className=" p-2 text-green-600">You already bought 😊!</span>
      ) : (
        <form action={onCheckout} method="post">
          <Button
            type="submit"
            role="link"
            size="lg"
            className="button sm:w-fit"
            disabled={isBought === null}
          >
            {event.isFree ? "Get Ticket" : "Buy Ticket"}
          </Button>
        </form>
      )}
    </>
  );
}

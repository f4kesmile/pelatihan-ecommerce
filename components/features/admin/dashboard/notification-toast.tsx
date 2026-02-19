"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  BadgeCheck,
  ShoppingCart,
  Package,
  ArrowRight,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { toast } from "sonner";

interface NotificationToastProps {
  notifications: {
    pendingOrders: number;
    lowStockVariants: number;
  } | null;
  totalNotifications: number;
  t: string | number; // Toast ID
}

export function NotificationToast({
  notifications,
  totalNotifications,
  t,
}: NotificationToastProps) {
  if (totalNotifications === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="w-80 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl p-4 flex items-center gap-4"
      >
        <div className="p-3 bg-green-500 rounded-lg text-white shadow-sm">
          <BadgeCheck className="size-5" />
        </div>
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
            All Caught Up
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            No new notifications at the moment.
          </p>
        </div>
      </motion.div>
    );
  }

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl overflow-hidden"
    >
      {/* Animated Header */}
      <motion.div
        variants={item}
        className="px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Bell className="size-5 text-zinc-700 dark:text-zinc-300" />
            </motion.div>
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-600 rounded-full ring-2 ring-white dark:ring-zinc-900 animate-ping" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-600 rounded-full ring-2 ring-white dark:ring-zinc-900" />
          </div>
          <span className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Notifications
          </span>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold px-2.5 py-1 rounded-md"
        >
          {totalNotifications}
        </motion.div>
      </motion.div>

      {/* Animated List */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
        {notifications?.pendingOrders ? (
          <Link href="/dashboard/orders" onClick={() => toast.dismiss(t)}>
            <motion.div
              variants={item}
              whileHover={{
                scale: 1.02,
                x: 4,
                backgroundColor: "var(--bg-hover)",
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-start gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
              style={{ "--bg-hover": "rgba(0,0,0,0.02)" } as any}
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="mt-1 h-10 w-10 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-sm shrink-0"
              >
                <ShoppingCart className="size-5" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Pending Orders
                  </p>
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-900/30">
                    URGENT
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-900 dark:text-zinc-200">
                    {notifications.pendingOrders} orders
                  </strong>{" "}
                  are waiting to be processed. Check details to ship item.
                </p>
              </div>
              <motion.div
                initial={{ x: 0, opacity: 0.5 }}
                whileHover={{ x: 3, opacity: 1 }}
              >
                <ArrowRight className="size-4 text-zinc-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors mt-1" />
              </motion.div>
            </motion.div>
          </Link>
        ) : null}

        {notifications?.lowStockVariants ? (
          <Link href="/dashboard/products" onClick={() => toast.dismiss(t)}>
            <motion.div
              variants={item}
              whileHover={{
                scale: 1.02,
                x: 4,
                backgroundColor: "var(--bg-hover)",
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-start gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
              style={{ "--bg-hover": "rgba(0,0,0,0.02)" } as any}
            >
              <motion.div
                whileHover={{ rotate: -15, scale: 1.1 }}
                className="mt-1 h-10 w-10 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm shrink-0"
              >
                <Package className="size-5" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Low Stock Alert
                  </p>
                  <span className="text-[10px] font-semibold text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/30">
                    WARNING
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-900 dark:text-zinc-200">
                    {notifications.lowStockVariants} products
                  </strong>{" "}
                  are running low on inventory. Please restock immediately.
                </p>
              </div>
              <motion.div
                initial={{ x: 0, opacity: 0.5 }}
                whileHover={{ x: 3, opacity: 1 }}
              >
                <ArrowRight className="size-4 text-zinc-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors mt-1" />
              </motion.div>
            </motion.div>
          </Link>
        ) : null}
      </div>
    </motion.div>
  );
}

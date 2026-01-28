import { CartItem } from "@/components/features/cart/cart-context"

interface CreateWhatsAppMessageParams {
  items: CartItem[]
  subtotal: number
  customer: {
    name: string
    phone: string
    address: string
    notes?: string
  }
  adminNumber?: string
  template?: string
}

export function createWhatsAppOrderLink({ items, subtotal, customer, adminNumber, template }: CreateWhatsAppMessageParams) {
  const phoneNumber = adminNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "628123456789" 

  let greeting = template || "Halo Kak, saya mau pesan di Zinc Store:"
  greeting = greeting.replace("{customerName}", customer.name)
  
  const itemsList = items
    .map((item, index) => {
      return `${index + 1}. ${item.name} (${item.variantName}) x${item.quantity} - ${formatMoney(item.price * item.quantity)}`
    })
    .join("\n")
    
  const total = `*Total: ${formatMoney(subtotal)}*`
  
  const customerDetails = `
*Detail Pengiriman:*
Nama: ${customer.name}
No. HP: ${customer.phone}
Alamat: ${customer.address}
${customer.notes ? `Catatan: ${customer.notes}` : ""}
`.trim()

  const message = `${greeting}

${itemsList}

${total}

----------------
${customerDetails}
`.trim()

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

import { Phone } from 'lucide-react'

export default function WhatsappButton() {
  return (
    <a
      href="https://wa.me/5521983327985"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center overflow-hidden rounded-full bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:w-44 hover:bg-green-700 border-2 border-background dark:border-border/40 backdrop-blur-sm"
    >
      <div className="flex h-14 w-14 items-center justify-center">
        <Phone 
          size={22} 
          className="group-hover:rotate-12 transition-transform duration-300 drop-shadow-sm" 
        />
      </div>
      <span className="ml-2 hidden whitespace-nowrap text-sm font-semibold transition-opacity duration-300 ease-in-out group-hover:flex drop-shadow-sm">
        Suporte
      </span>
    </a>
  )
}

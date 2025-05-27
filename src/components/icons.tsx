
import { 
  LucideProps, 
  Moon, 
  SunMedium, 
  type LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  logo: (props: LucideProps) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m11.572 0 4.428 5h6v6l-5 4.428V24h-6v-8.572L6 11V5h6V0h-.428z"
      />
    </svg>
  ),
}

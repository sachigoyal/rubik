import { createFileRoute } from "@tanstack/react-router"
import { LandingPage } from "@/components/landing/landing-page"
import { pageHead } from "@/lib/site"

export const Route = createFileRoute("/")({
  head: () => pageHead({ path: "/" }),
  component: LandingPage,
})

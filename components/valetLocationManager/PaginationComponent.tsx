"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

const Pagination = ({
  totalPages,
}: {
  totalPages: number
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 20)

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("page", String(newPage))
    params.set("limit", String(limit))

    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center justify-between mt-4">
      
      {/* PREV */}
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => updatePage(page - 1)}
      >
        Prev
      </Button>

      {/* INFO */}
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      {/* NEXT */}
      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => updatePage(page + 1)}
      >
        Next
      </Button>

    </div>
  )
}

export default Pagination
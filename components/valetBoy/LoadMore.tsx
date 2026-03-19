"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

const Pagination = ({ currentPage }: { currentPage: number }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const limit = Number(searchParams.get("limit") || 10)

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(newPage))
    params.set("limit", String(limit))

    router.push(`?${params.toString()}`, {scroll: false})
  }

  return (
    <div className="flex justify-center gap-3 mt-4">
      {/* Prev */}
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => updatePage(currentPage - 1)}
      >
        Prev
      </Button>

      {/* Page Info */}
      <span className="flex items-center text-sm text-muted-foreground">
        Page {currentPage}
      </span>

      {/* Next */}
      <Button
        variant="outline"
        onClick={() => updatePage(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination
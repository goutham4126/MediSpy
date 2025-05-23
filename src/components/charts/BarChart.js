"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  total: {
    label: "Total Consultations",
    color: "#2563eb",
  }
}

export function Component({ consultations }) {
  const processConsultationData = () => {
    const dataMap = new Map()
    
    consultations.forEach(consultation => {
      const date = new Date(consultation.date).toISOString().split('T')[0]
      
      if (!dataMap.has(date)) {
        dataMap.set(date, {
          date,
          total: 0,
        })
      }
      
      dataMap.get(date).total += 1
    })
    
    return Array.from(dataMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const chartData = processConsultationData()
  const totalConsultations = chartData.reduce((acc, curr) => acc + curr.total, 0)

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Consultation Trends</CardTitle>
          <CardDescription>
            Showing consultation volume by day
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1  px-6 py-4 text-left sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              {chartConfig.total.label}
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {totalConsultations.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="Consultations"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar 
              dataKey="total" 
              fill="#2563eb" 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
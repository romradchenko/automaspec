'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Test, TestRequirement, TestSpec } from '@/lib/types'

interface VitestCodeTabProps {
    spec: TestSpec
    requirements: TestRequirement[]
    tests: Test[]
    generateTestCode: (spec: TestSpec, reqs: TestRequirement[], tests: Test[]) => string
}

export function VitestCodeTab({ spec, requirements, tests, generateTestCode }: VitestCodeTabProps) {
    const [copied, setCopied] = useState(false)

    const copyTestCode = async () => {
        const testCode = generateTestCode(spec, requirements, tests)
        await navigator.clipboard.writeText(testCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-medium text-sm sm:text-base">Generated Test Code</h3>
                <Button onClick={copyTestCode} size="sm" className="w-full sm:w-auto">
                    {copied ? (
                        <>
                            <Check className="mr-1 size-4" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="mr-1 size-4" />
                            <span className="hidden sm:inline">Copy Test Code</span>
                            <span className="sm:hidden">Copy</span>
                        </>
                    )}
                </Button>
            </div>
            <div className="max-h-[300px] overflow-auto rounded-lg bg-slate-950 p-3 font-mono text-slate-50 text-xs sm:max-h-[500px] sm:p-4 sm:text-sm">
                <pre className="whitespace-pre-wrap wrap-break-words">
                    {generateTestCode(spec, requirements, tests)}
                </pre>
            </div>
        </div>
    )
}

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, FileJson, CheckCircle, FolderTree, FileText, ListChecks, TestTube } from 'lucide-react'
import { useState, useRef } from 'react'
import { toast } from 'sonner'

import type { VitestReport } from '@/lib/types'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { FILE_UPLOAD } from '@/lib/constants'
import { safeClient } from '@/lib/orpc/orpc'
import { vitestReportSchema } from '@/lib/types'

import { invalidateAndRefetchQueries } from '../hooks'

interface ImportTestsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onImportComplete?: () => void
}

export function ImportTestsDialog({ open, onOpenChange, onImportComplete }: ImportTestsDialogProps) {
    const [parsedReport, setParsedReport] = useState<VitestReport | null>(null)
    const [parseError, setParseError] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const queryClient = useQueryClient()

    const importMutation = useMutation({
        mutationFn: async (report: VitestReport) => {
            const { data, error } = await safeClient.tests.importFromJson(report)
            if (error) throw error
            return data
        },
        onSuccess: async (result) => {
            toast.success(
                `Import complete: ${result.foldersCreated} folders, ${result.specsCreated} specs, ${result.requirementsCreated} requirements, ${result.testsCreated} tests created`
            )
            await invalidateAndRefetchQueries(queryClient, '/test-folders')
            await invalidateAndRefetchQueries(queryClient, '/test-specs')
            await invalidateAndRefetchQueries(queryClient, '/test-requirements')
            await invalidateAndRefetchQueries(queryClient, '/tests')
            handleReset()
            onOpenChange(false)
            onImportComplete?.()
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to import tests')
        }
    })

    function validateFileType(file: File): string | null {
        const fileName = file.name.toLowerCase()
        const hasValidExtension = FILE_UPLOAD.ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext))
        if (!hasValidExtension) {
            return `Invalid file extension. Only ${FILE_UPLOAD.ALLOWED_EXTENSIONS.join(', ')} files are allowed.`
        }

        const mimeType = file.type || ''
        if (mimeType !== '' && mimeType !== 'application/json') {
            return `Invalid file type. Only JSON files are allowed.`
        }

        if (file.size > FILE_UPLOAD.MAX_SIZE_BYTES) {
            const maxSizeMB = FILE_UPLOAD.MAX_SIZE_BYTES / (1024 * 1024)
            return `File is too large. Maximum size is ${maxSizeMB}MB.`
        }

        return null
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return

        setFileName(file.name)
        setParseError(null)

        const validationError = validateFileType(file)
        if (validationError) {
            setParseError(validationError)
            setParsedReport(null)
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string

                if (!content.trim().startsWith('{') && !content.trim().startsWith('[')) {
                    setParseError('File content is not valid JSON')
                    setParsedReport(null)
                    return
                }

                const json = JSON.parse(content)
                const validated = vitestReportSchema.safeParse(json)

                if (!validated.success) {
                    setParseError('Invalid Vitest report format')
                    setParsedReport(null)
                    return
                }

                setParsedReport(validated.data)
            } catch {
                setParseError('Failed to parse JSON file')
                setParsedReport(null)
            }
        }
        reader.readAsText(file)
    }

    function handleReset() {
        setParsedReport(null)
        setParseError(null)
        setFileName(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    function handleImport() {
        if (parsedReport) {
            importMutation.mutate(parsedReport)
        }
    }

    function handleOpenChange(open: boolean) {
        if (!open) {
            handleReset()
        }
        onOpenChange(open)
    }

    const testCount =
        parsedReport?.testResults?.reduce((acc, result) => {
            return acc + (result.assertionResults?.length || 0)
        }, 0) || 0

    const fileCount = parsedReport?.testResults?.length || 0

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Upload className="size-5" />
                        Import Tests from JSON
                    </SheetTitle>
                    <SheetDescription>
                        Upload a Vitest JSON report to import your existing tests. This will create folders, specs,
                        requirements, and tests based on your test structure.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                    <div
                        role="button"
                        tabIndex={0}
                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors hover:border-muted-foreground/50"
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                fileInputRef.current?.click()
                            }
                        }}
                    >
                        <FileJson className="mb-3 size-10 text-muted-foreground" />
                        <p className="text-sm font-medium">{fileName ? fileName : 'Click to upload JSON file'}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Supports Vitest JSON reporter output</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,application/json"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {parseError && (
                        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                            <p className="text-sm text-destructive">{parseError}</p>
                        </div>
                    )}

                    {parsedReport && (
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <CheckCircle className="size-5 text-green-600" />
                                <span className="font-medium">Report parsed successfully</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <FolderTree className="size-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Files:</span>
                                    <span className="font-medium">{fileCount}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="size-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Specs:</span>
                                    <span className="font-medium">{fileCount}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ListChecks className="size-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Requirements:</span>
                                    <span className="font-medium">{testCount}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TestTube className="size-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Tests:</span>
                                    <span className="font-medium">{testCount}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <SheetFooter className="mt-6">
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleImport} disabled={!parsedReport || importMutation.isPending}>
                        {importMutation.isPending ? 'Importing...' : 'Import Tests'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

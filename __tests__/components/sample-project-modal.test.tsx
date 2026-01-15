import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { SampleProjectModal } from '@/app/(onboarding)/onboarding/components/sample-project-modal'

describe('SampleProjectModal', () => {
    it('renders modal with welcome content when open', () => {
        render(<SampleProjectModal open={true} onOpenChange={vi.fn()} onConfirm={vi.fn()} isLoading={false} />)

        expect(screen.getByText('Welcome to Automaspec')).toBeDefined()
        expect(screen.getByText('What Automaspec does for you')).toBeDefined()
        expect(screen.getByText('Automatic Test Organization')).toBeDefined()
        expect(screen.getByText('Requirements & Traceability')).toBeDefined()
        expect(screen.getByText('Sync with CI/CD')).toBeDefined()
        expect(screen.getByText('Analytics & Trends')).toBeDefined()
        expect(screen.getByText('Team Collaboration')).toBeDefined()
        expect(screen.getByText('AI-Powered Suggestions')).toBeDefined()
    })

    it('calls onConfirm when explore button is clicked', () => {
        const onConfirm = vi.fn()
        render(<SampleProjectModal open={true} onOpenChange={vi.fn()} onConfirm={onConfirm} isLoading={false} />)

        fireEvent.click(screen.getByText('Explore with Sample Data'))
        expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it('calls onOpenChange with false when cancel is clicked', () => {
        const onOpenChange = vi.fn()
        render(<SampleProjectModal open={true} onOpenChange={onOpenChange} onConfirm={vi.fn()} isLoading={false} />)

        fireEvent.click(screen.getByText('Cancel'))
        expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('shows loading state and disables buttons when isLoading is true', () => {
        render(<SampleProjectModal open={true} onOpenChange={vi.fn()} onConfirm={vi.fn()} isLoading={true} />)

        expect(screen.getByText('Loading...')).toBeDefined()
        expect(screen.getByText('Cancel').closest('button')).toHaveProperty('disabled', true)
        expect(screen.getByText('Loading...').closest('button')).toHaveProperty('disabled', true)
    })

    it('does not render content when closed', () => {
        render(<SampleProjectModal open={false} onOpenChange={vi.fn()} onConfirm={vi.fn()} isLoading={false} />)

        expect(screen.queryByText('Welcome to Automaspec')).toBeNull()
    })
})

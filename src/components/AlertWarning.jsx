import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

export default function AlertWarning(props) {
    const { message } = props
    return (
        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="inline-flex ml-3">
                    <p className="text-sm text-yellow-700">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    )
}

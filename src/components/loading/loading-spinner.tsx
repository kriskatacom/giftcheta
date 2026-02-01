export default function LoadingSpinner() {
    return (
        <div className="relative flex items-center justify-center">
            <div className="h-12 w-12 mb-30 border-4 border-t-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
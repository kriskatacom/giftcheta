export default function LoadingBar() {
    return (
        <div className="relative h-1 w-full overflow-hidden bg-muted">
            <div className="absolute h-full w-1/3 bg-linear-to-r from-primary via-purple-500 to-primary animate-loading-bar" />
        </div>
    );
}
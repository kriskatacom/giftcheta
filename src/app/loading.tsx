import MainNavbar from "@/components/main-navbar";
import LoadingBar from "@/components/loading/loading-bar";
import LoadingSpinner from "@/components/loading/loading-spinner";

export default function Loading() {
    return (
        <>
            <MainNavbar />
            <LoadingBar />
            <div className="min-h-screen flex flex-col justify-center items-center">
                <LoadingSpinner />
            </div>
        </>
    );
}

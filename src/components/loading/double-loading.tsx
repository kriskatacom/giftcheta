import LoadingBar from "@/components/loading/loading-bar";
import LoadingSpinner from "@/components/loading/loading-spinner";
import MainNavbar from "../main-navbar";

export default function DoubleLoading() {
    return (
        <>
            <MainNavbar />
            <LoadingBar />
            <LoadingSpinner />
        </>
    );
}

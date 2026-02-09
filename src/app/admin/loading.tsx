import LoadingSpinner from "@/components/loading/loading-spinner";
import MainSidebarServer from "@/components/main-sidebar/main-sidebar-server";

export default function Loading() {
    return (
        <div>
            <MainSidebarServer />
            <div className="w-full min-h-screen flex justify-center items-center">
                <LoadingSpinner />
            </div>
        </div>
    );
}

import { useEffect } from "react";

export const usePageTitle = (title: string) => {
    useEffect(() => {
        document.title = `${title} | ACE Mail`;
        return () => {
            document.title = "ACE Mail";
        };
    }, [title]);
};

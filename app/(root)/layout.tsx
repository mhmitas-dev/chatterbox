import Navbar from '@/components/ui/shared/Navbar';
import React from 'react'

const HomeLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}

export default HomeLayout
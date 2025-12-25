import React, { Suspense } from 'react'

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div>
            <Suspense fallback={<h1>Loading...</h1>}>
                {children}
            </Suspense>
        </div>
    )
}

export default layout
import { Button } from '../button'
import Link from 'next/link'

const Navbar = () => {
    return (
        <nav className='bg-card text-card-foreground'>
            <div className='flex items-center justify-between max-w-5xl h-16 mx-auto'>
                <div>
                    <button className='text-lg font-medium'>Chatterbox</button>
                </div>
                <ul>
                    <li>
                        <a href={"/room-v1?target=create-room"} target='_blank'>
                            <Button>Create Room</Button>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
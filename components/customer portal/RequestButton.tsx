'use client';

import { handleRequest } from '@/lib/socket/request';
import { Button } from '../ui/button'
import { useState } from 'react';

const RequestButton = ({ id }: { id: number }) => {

    const [change, setChange] = useState(false)
    
    const handleClick = async () => {

        try {
            const res = await handleRequest(id);
            if(!res.success){
                alert("Failed to request. Try again in a few minutes");
                return;
            }
            setChange(true)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='w-full'>
            {change ? 
            <Button className="w-full" type="button">Car Requested</Button>
            :
            <Button className="w-full" type="button" onClick={handleClick}>Get My Car</Button>
        }
        </div>
    )
}

export default RequestButton
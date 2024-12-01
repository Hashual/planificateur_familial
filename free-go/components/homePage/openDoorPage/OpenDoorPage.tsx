import React from 'react';
import Fridge from '../shared/Fridge';
import FridgeDoor from './FridgeDoor';
import FridgeBottom from '../shared/FridgeBottom';


const DoorPage: React.FC = () => {
    return (
        <Fridge>
            <FridgeDoor />
            <FridgeBottom />
        </Fridge>
    );
}

export default DoorPage;
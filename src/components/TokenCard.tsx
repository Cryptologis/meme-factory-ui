// Example updated TokenCard.tsx
import React from 'react';
import { decodeFixedString } from 'path-to-decodeFixedString';

interface TokenCardProps {
    token: TokenInfo;
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
    const name = decodeFixedString(token.name);
    const symbol = decodeFixedString(token.symbol);
    const uri = decodeFixedString(token.uri);

    return (
        <div>
            <h1>{name}</h1>
            <p>{symbol}</p>
            <img src={uri} alt={name} />
        </div>
    );
};

export default TokenCard;
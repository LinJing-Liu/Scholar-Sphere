import React, { useEffect, useState } from 'react';

const TagDisplay = ({ tags }) => {
    return (
        <div>
            {tags.map((t, id) => <li key={id}>{t}</li>)}
        </div>
    );
};

export default TagDisplay;
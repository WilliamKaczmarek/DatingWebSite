import React from 'react';
import AvatarEditor from 'react-avatar-editor';

/**
 * Composant qui permet le rognage d'une photo en photo carrée
 */
const ImageCrop = ({ imageSrc, onCrop, setEditorRef, scaleValue, onScaleChange}) => (
    <div >
        <AvatarEditor image={imageSrc} border={20} scale={scaleValue} ref={setEditorRef} />
        <br/>
        <input style={{ width:"50%"}} type="range" value={scaleValue} min="1" max="10" step="0.05" onChange={onScaleChange}/>
        <button className="btn-simple" onClick={onCrop}>valider</button>
    </div>
);

export default ImageCrop;
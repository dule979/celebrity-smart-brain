import React from "react";
import './ImageLinkForm.css';

const ImageLinkForm = () => {
  return (
    <div>
        <p className="f4">{'This Magic Brain will detect faces in your pictures. Give it a try.'}</p>
        <div className="flex-center">
            <div className="flex-center form pa4 br3 shadow-5">
                <input type='text' className="w-70 pa2 f5 "/>
                <button className="w-30 f5 link ph3 pv2 grow white dib bg-light-purple">Detect</button>
            </div>
        </div>
    </div>
  );
};

export default ImageLinkForm;

import React from 'react'
import { SlideshowLightbox } from 'lightbox.js-react'
import 'lightbox.js-react/dist/index.css'
import { viewer } from './model/viewer'
export const Viewer = ({ images, setOpenViewer,openViewer, imageIndex = 0 }: { images: viewer[],openViewer:boolean, setOpenViewer: (open: boolean) => void, imageIndex: number }) => {
    return (<>
        <SlideshowLightbox
            images={images}
            showThumbnails={true}
            open={openViewer}
            startingSlideIndex={imageIndex}
            lightboxIdentifier="lbox1"
            onClose={() => { setOpenViewer(false) }}>
        </SlideshowLightbox>
    </>)
}
export default Viewer;

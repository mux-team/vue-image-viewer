import ImageViewer from './components/ImageViewer';

export default ImageViewer;

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.component('vue-image-viewer', ImageViewer);
}

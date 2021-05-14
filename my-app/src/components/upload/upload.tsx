
import './upload.css'

export default function Uploadfile() {
    var blobList: String[] = []
    var filenames: String[] = []
    return (
        <form className = "content" action="http://localhost:4000/upload" method="post" encType="multipart/form-data">
            <p><i>Select memes to upload</i></p><br />
            <input  type="file"
                    name="image"
                    id="file_selector"
                    accept=".jpg, .jpeg, .png, .gif"
                    multiple onChange = {
                        e => {
                            e.preventDefault();
                            let image_content = document.getElementById('image_content')
                            const fileList = e.target.files
                            if(fileList != undefined && fileList.length>0){
                                for(var i=0;i<fileList.length;i++){
                                    var blob = URL.createObjectURL(fileList[i])
                                    var file = fileList[i].name
                                    blobList.push(blob)
                                    filenames.push(file)
                                    let image = document.createElement('img')
                                    image.src = blob
                                    image_content?.appendChild(image)
                                }
                            }
                        }
                    }/>
            <br />
            <div id = "image_content"></div><br />
            <input id="upload" type="submit" value="Upload" />
        </form>
    );
}

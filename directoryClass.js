class Directory {
    constructor(name) {
      this.name = name;
      this.contents = [];
    }


    addFile(file) {
        if (this.contents.some(item => item.name === file.name)) {
          throw new Error(`File with name ${file.name} already exists in directory ${this.name}`);
        }
        this.contents.push(file);
      }
    
      addDirectory(directory) {
        if (this.contents.some(item => item.name === directory.name)) {
          throw new Error(`Directory with name ${directory.name} already exists in directory ${this.name}`);
        }
        this.contents.push(directory);
      }
    }


module.exports = Directory;
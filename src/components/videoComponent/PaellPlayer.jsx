import React, { Component } from "react";
import VideoShow from "./VideoShow/VideoShow";

export default class PaellPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loid: "",
      videoSource: "",
      youtubeaudioURL: "",
      src: "",
      vIDyoutube: "",
      isVideo: false,
    };
  }

  updateValues = (e) => {
    this.props.onUpdateCheckbox(e);
    // onUpdateParent would be passed here and would result
    // into onUpdateParent(e.target.value) as it will replace this.props.onUpdate
    //with itself.
    //this.setState({ fieldValChild: e });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    this.props.onUpdateCheckbox(e.target.value);
  };

  componentDidMount() {
    var rand = Math.floor(Math.random() * 1000000 + 1);

    this.setState({
      videoSource: this.props.videoSource,
    });

    if (this.extractHostname(this.props.videoSource) === "www.youtube.com") {
      var res = this.props.videoSource.match(
        /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
      );

      // var res = this.props.videoSource.split("=");
      var embeddedUrl = "https://www.youtube.com/embed/" + res[1];
      this.setState({
        vIDyoutube: res[1],
      });
      this.setState({
        //src: embeddedUrl,
        src: "/player/index-custom.html?id=multi-lang-audio&uid=" + rand,
      });

      var vid = res[1];

      // Fetch video info (using a proxy to avoid CORS errors)

      function parse_str(str) {
        return str.split("&").reduce(function (params, param) {
          var paramSplit = param.split("=").map(function (value) {
            return decodeURIComponent(value.replace("+", " "));
          });
          params[paramSplit[0]] = paramSplit[1];
          return params;
        }, {});
      }
    } else if (
      this.extractHostname(this.props.videoSource) !==
      "scube-applications-media54cbabfc-u3d19945rbtv.s3.eu-west-1.amazonaws.com"
    ) {
      this.setState({ src: "" + this.props.videoSource + "" });

      var fileextention = this.props.videoSource
        .split(/[#?]/)[0]
        .split(".")
        .pop()
        .trim();
      console.log(fileextention);
      if (fileextention === "mp4") {
        this.setState({
          src: "/player/index-custom.html?id=multi-lang-audio&uid=" + rand,
        });
      } else if (
        fileextention === "ppt" ||
        fileextention === "pptx" ||
        fileextention === "doc" ||
        fileextention === "docx" ||
        fileextention === "pps"
      ) {
        this.setState({
          src:
            "https://view.officeapps.live.com/op/embed.aspx?src=" +
            this.props.videoSource,
        });
      } else if (fileextention === "pdf") {
        this.setState({
          src:
            "https://docs.google.com/gview?url=" +
            this.props.videoSource +
            "&embedded=true",
        });
      } else if (fileextention === "html") {
        this.setState({ src: "" + this.props.videoSource + "" });
      } else if (
        this.props.videoSource !== "" &&
        typeof this.props.videoSource !== "undefined" &&
        this.props.videoSource !== ""
      ) {
        this.setState({
          src: "newwindow.png",
        });
        window.open(
          this.props.videoSource,
          "",
          "toolbar=yes,scrollbars=yes,resizable=yes"
        ); //top=300,left=300,width=500,height=500"
      }
    } else if (
      this.extractHostname(this.props.videoSource) ===
      "scube-applications-media54cbabfc-u3d19945rbtv.s3.eu-west-1.amazonaws.com"
    ) {
      var fileextentionhtml = this.props.videoSource
        .split(/[#?]/)[0]
        .split(".")
        .pop()
        .trim();
      if (!fileextention) {
        let x = this.props.videoSource.split(/\.*\?/)[0];
        let a = x.split(".");
        fileextention = a[a.length - 1];
        console.log(fileextention);
      }

      if (fileextentionhtml === "html") {
        this.setState({
          src: this.props.videoSource,
        });
      } else if (
        (fileextention === "mp4" ||
          ["mp3", "wav", "mpeg", "acc"].includes(fileextention)) &&
        this.props.isNormal
      ) {
        this.setState({
          src: this.props.videoSource,
          isVideo: true,
        });
      } else if (
        ["ppt", "pptx", "docx", "doc"].includes(fileextention) &&
        this.props.isNormal
      ) {
        this.setState({
          src: this.props.videoSource,
        });
      } else if (fileextention === "pdf" && this.props.isNormal) {
        this.setState({
          src: this.props.videoSource,
        });
      } else {
        this.setState({
          src: "/player/index-custom.html?id=multi-lang-audio&uid=" + rand,
        });
        // console.log(this.state.src);
      }
    } else {
      this.setState({
        src: this.props.videoSource,
      });
    }

    // document.getElementById("1010").contentDocument.location.reload(true)
    //for reloading instead of rand
    // this.setState({
    //    videoSource: this.props.videoSource,
    //  })

    try {
      //1document.getElementById("1010").contentDocument.location.reload(true)
      // window.open("https://www.w3schools.com");
      //console.log("new window")
    } catch (err) {}

    // if(prevProps.loobjectid !== this.props.loobjectid){
    //   this.setState({
    //     loid: this.props.loobjectid
    // });
    //    }
  }

  extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
      hostname = url.split("/")[2];
    } else {
      hostname = url.split("/")[0];
    }

    //find & remove port number
    hostname = hostname.split(":")[0];
    //find & remove "?"
    hostname = hostname.split("?")[0];

    return hostname;
  }
  load(e) {
    alert(e);
  }

  error() {
    alert("error");
  }
  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate !!");
    console.log("videoSource= ", this.props.videoSource);
    var rand = Math.floor(Math.random() * 1000000 + 1);

    if (this.props.videoSource !== this.state.videoSource) {
      this.setState({
        videoSource: this.props.videoSource,
      });

      if (this.extractHostname(this.props.videoSource) === "www.youtube.com") {
        var res = this.props.videoSource.match(
          /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
        );

        // var res = this.props.videoSource.split("=");
        var embeddedUrl = "https://www.youtube.com/embed/" + res[1];
        this.setState({
          vIDyoutube: res[1],
        });
        this.setState({
          //src: embeddedUrl,
          src: "/player/index-custom.html?id=multi-lang-audio&uid=" + rand,
        });

        var vid = res[1];

        // Fetch video info (using a proxy to avoid CORS errors)

        function parse_str(str) {
          return str.split("&").reduce(function (params, param) {
            var paramSplit = param.split("=").map(function (value) {
              return decodeURIComponent(value.replace("+", " "));
            });
            params[paramSplit[0]] = paramSplit[1];
            return params;
          }, {});
        }
      } else if (
        this.extractHostname(this.props.videoSource) !==
        "scube-applications-media54cbabfc-u3d19945rbtv.s3.eu-west-1.amazonaws.com"
      ) {
        var fileextention = this.props.videoSource
          .split(/[#?]/)[0]
          .split(".")
          .pop()
          .trim();
        // if (this.props.isNormal) {
        //   this.setState({ src: this.props.videoSource })
        // }
        // else
        if (fileextention === "mp4") {
          this.setState({
            src: "/player/index-custom.html?id=multi-lang-audio&uid=" + rand,
          });
        } else if (
          fileextention === "ppt" ||
          fileextention === "pptx" ||
          fileextention === "doc" ||
          fileextention === "docx" ||
          fileextention === "pps"
        ) {
          this.setState({
            src:
              "https://view.officeapps.live.com/op/embed.aspx?src=" +
              this.props.videoSource,
          });
        } else if (fileextention === "pdf") {
          console.log("kdasjsadsasajkdsajksahksak");
          this.setState({
            src:
              "https://docs.google.com/gview?url=" +
              this.props.videoSource +
              "&embedded=true",
          });
        } else if (fileextention === "html") {
          this.setState({ src: "" + this.props.videoSource + "" });
        } else if (
          this.props.videoSource !== "" &&
          typeof this.props.videoSource !== "undefined" &&
          this.props.videoSource !== ""
        ) {
          this.setState({
            src: "newwindow.png",
          });
          window.open(
            this.props.videoSource,
            "",
            "toolbar=yes,scrollbars=yes,resizable=yes"
          ); //top=300,left=300,width=500,height=500"
        }
      } else if (
        this.extractHostname(this.props.videoSource) ===
        "scube-applications-media54cbabfc-u3d19945rbtv.s3.eu-west-1.amazonaws.com"
      ) {
        var fileextentionhtml = this.props.videoSource
          .split(/[#?]/)[0]
          .split(".")
          .pop()
          .trim();
        if (!fileextention) {
          let x = this.props.videoSource.split(/\.*\?/)[0];
          let a = x.split(".");
          fileextention = a[a.length - 1];
        }
        if (fileextentionhtml === "html") {
          this.setState({
            src: this.props.videoSource,
          });
        } else if (
          (fileextention === "mp4" ||
            ["mp3", "wav", "mpeg", "acc"].includes(fileextention)) &&
          this.props.isNormal
        ) {
          this.setState({
            src: this.props.videoSource,
            isVideo: true,
          });
        } else if (
          ["ppt", "pptx", "docx", "doc"].includes(fileextention) &&
          this.props.isNormal
        ) {
          this.setState({
            src: this.props.videoSource,
          });
        } else if (fileextention === "pdf" && this.props.isNormal) {
          this.setState({
            src: this.props.videoSource,
          });
        } else {
          this.setState({
            src: "/player/index-custom.html?id=multi-lang-audio&uid=" + rand,
          });
          // console.log(this.state.src);
        }
      } else {
        this.setState({
          src: this.props.videoSource,
        });
      }

      // document.getElementById("1010").contentDocument.location.reload(true)
      //for reloading instead of rand
      // this.setState({
      //    videoSource: this.props.videoSource,
      //  })
      try {
        //1  document.getElementById("1010").contentDocument.location.reload(true)
        // window.open("https://www.w3schools.com");
        //console.log("new window")
      } catch (err) {}
    }

    // if(prevProps.loobjectid !== this.props.loobjectid){
    //   this.setState({
    //     loid: this.props.loobjectid
    // });
    //    }
  }

  componentWillUnmount() {}

  //shouldComponentUpdate(nextProps, nextState){

  //   if(nextProps.loobjectid !== this.props.loobjectid){
  //        this.setState({
  //            loid: nextProps.loobjectid
  //       });
  //        this.setst();
  //        return true;
  //   }

  //   return false;
  //}

  //loadavideo=(x,mp4url)=>{
  //  console.log(x);
  //  window.paella.load('playerContainerid',{})

  //}

  render() {
    console.log(this.state.src);

    return (
      <div>
        <div className="col-md-12">
          <div className="emdeb-responsive">
            {localStorage.setItem("label", this.props.videoSource)}
            {localStorage.setItem("labelvtt", this.props.videoVtt)}
            {localStorage.setItem("labeltitle", this.props.topicTitle)}
            {localStorage.setItem("loobjcId", this.props.loobjectid)}
            {localStorage.setItem("IsMediaFile", this.props.IsMediaFile)}
            {localStorage.setItem("noErrorLO", this.props.noErrorLO)}
            {localStorage.setItem("contentType", this.props.contentType)}

            {localStorage.setItem(
              "hostname",
              this.extractHostname(this.props.videoSource)
            )}
            {localStorage.setItem("audioURL", this.state.youtubeaudioURL)}
            {localStorage.setItem("vIDyoutube", this.state.vIDyoutube)}

            {localStorage.setItem(
              "keyframelist",
              JSON.stringify(this.props.framelist)
            )}

            {localStorage.setItem(
              "keyaudiotracklist",
              JSON.stringify(this.props.audiotracklist)
            )}
            {localStorage.setItem(
              "keyplayedLo",
              JSON.stringify(this.props.playedLo)
            )}

            {/* localStorage.setItem('Iframesrc',  "http://localhost:3000/player/index-custom.html?id=multi-lang-audio")}
                        
        { document.write(" <iframe  id='1010' name='frame' src='" + localStorage.getItem('Iframesrc') + "' width='550'  height='550'></iframe>")*/}

            {false ? (
              <VideoShow />
            ) : (
              <iframe
                id="1010"
                title="eduedgePlayer"
                frameBorder="0"
                src={this.state.src}
                // height="550"
                width={
                  this.props.isH5p
                    ? "1000px"
                    : this.props.IsMediaFile
                    ? "550px"
                    : "500"
                }
                height={
                  this.props.isH5p
                    ? "650px"
                    : this.props.IsMediaFile
                    ? "500"
                    : "480"
                }
                onerror={this.error}
                onload={this.load}
              ></iframe>
            )}

            {/*<iframe id='1010'  frameBorder="0" src="/player/index-custom.html?id=multi-lang-audio" width="550" height="550"></iframe>*/}
          </div>

          <div>
            <input
              type="checkbox"
              defaultChecked={false}
              name="scales"
              id="scales"
              onChange={(e) => {
                this.handleChange({
                  target: {
                    name: e.target.name,
                    value: e.target.checked,
                  },
                });
              }} //;this.props.onTranslationClick}
            />
            <label id="label10" for="scales">
              Show translated slides
            </label>
          </div>

          {false &&
          this.props.IsMediaFile === false &&
          typeof this.props.playList === "undefined" ? (
            <div className="btns-container" style={{ width: 550 }}>
              <button
                className="btn btn-info"
                onClick={() => {
                  this.props.previousHandler();
                }}
              >
                Prev
              </button>

              <button
                className="btn btn-info"
                onClick={() => {
                  this.props.nextHandler();
                }}
              >
                Next
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }
}

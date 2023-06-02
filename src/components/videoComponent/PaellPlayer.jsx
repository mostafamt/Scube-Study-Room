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
      }
    } else {
      this.setState({
        src: this.props.videoSource,
      });
    }
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
    // alert(e);
  }

  error() {
    alert("error");
  }
  componentDidUpdate(prevProps) {
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
        }
      } else {
        this.setState({
          src: this.props.videoSource,
        });
      }
    }
  }

  componentWillUnmount() {}

  render() {
    localStorage.setItem("label", this.props.videoSource);
    localStorage.setItem("labelvtt", this.props.videoVtt);
    localStorage.setItem("labeltitle", this.props.topicTitle);
    localStorage.setItem("loobjcId", this.props.loobjectid);
    localStorage.setItem("IsMediaFile", this.props.IsMediaFile);
    localStorage.setItem("noErrorLO", this.props.noErrorLO);
    localStorage.setItem("contentType", this.props.contentType);
    localStorage.setItem(
      "hostname",
      this.extractHostname(this.props.videoSource)
    );
    localStorage.setItem("audioURL", this.state.youtubeaudioURL);
    localStorage.setItem("vIDyoutube", this.state.vIDyoutube);
    localStorage.setItem("keyframelist", JSON.stringify(this.props.framelist));
    localStorage.setItem(
      "keyaudiotracklist",
      JSON.stringify(this.props.audiotracklist)
    );
    localStorage.setItem("keyplayedLo", JSON.stringify(this.props.playedLo));
    return (
      <div>
        <iframe
          id="1010"
          title="eduedgePlayer"
          frameBorder="0"
          src={this.state.src}
          // height="550"
          width={"100%"}
          height={
            this.props.isH5p ? "650px" : this.props.IsMediaFile ? "500" : "480"
          }
          onError={this.error}
          onLoad={this.load}
        ></iframe>

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
          <label id="label10" htmlFor="scales">
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
    );
  }
}

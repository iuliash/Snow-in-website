import React from 'react';

import logo_img from './logo.svg';

import s1 from './snowflake1.png'
import s2 from './snowflake2.png'
import s3 from './snowflake3.png'

const snow_count = 50;
const snow_img = [s1, s2, s3];
const snow_max_size = 25;
const snow_min_size = 8;
let go_snow;
let snow_show;
let remove_snow_array_flag = [];
let snow_is_let = false;

let snow_dx = [];
let snow_xp = [];
let snow_yp = [];
let snow_am = [];
let snow_stx = [];
let snow_sty = [];
let snow_size = [];

let snow_browser_width;
let snow_browser_height;
let logo;
let snow_time;

class Logo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            snow_size_range: 0
        }

        this.flagUp = this.flagUp.bind(this);
        this.flagDown = this.flagDown.bind(this);
        this.startSnow = this.startSnow.bind(this);
        this.stopSnow = this.stopSnow.bind(this);
    }

    componentDidMount() {
        logo = document.getElementById('logo');
        if (logo !== null) {
            logo.onmouseenter = this.flagUp;

            let date = new Date();
            let month = date.getMonth();
            go_snow = (month === 11 || month < 2);

            if (typeof(window.pageYOffset) === "number") {
                snow_browser_width = window.innerWidth;
                snow_browser_height = window.innerHeight; 
            } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
                snow_browser_width = document.body.offsetWidth;
                snow_browser_height = document.body.offsetHeight; 
            } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                snow_browser_width = document.documentElement.offsetWidth;
                snow_browser_height = document.documentElement.offsetHeight; 
            } else {
                snow_browser_width = 500;
                snow_browser_height = 500; 
            }

            this.setState({
                snow_size_range: snow_max_size - snow_min_size
            })
            // let snowsizerange = snow_max_size - snow_min_size;
        }
        
    }

    drawSnowflake() {
        for (let i = 0; i < snow_count; i++) {
            remove_snow_array_flag[i] = true;
            snow_dx[i] = 0;
                snow_xp[i] = Math.random() * (snow_browser_width);
                snow_yp[i] = - Math.random() * snow_browser_height;
                snow_am[i] = Math.random() * 20;
                snow_stx[i] = 0.03 + Math.random()/10;
                snow_sty[i] = 0.4 + Math.random();
            snow_size[i] = Math.floor(this.state.snow_size_range*Math.random()) + snow_min_size;

            let index = this.randomInteger(0, snow_img.length - 1);

            let box = document.getElementsByTagName('body')[0];
            var snwflk = document.createElement("img");
            snwflk.src = snow_img[index];
            snwflk.className = "snowflake";
            snwflk.id = 's'+ i;
            snwflk.style.position = 'absolute';
            snwflk.style.top = "-" + snow_max_size + 'px';
            snwflk.style.zIndex = "1" + i;
            box.appendChild(snwflk); 
        }
        this.startSnow();
    }
    

    randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    startSnow() {
        if (!snow_show) return false;
        for (let i = 0; i < snow_count; i++) {
            let snowflake = document.getElementById("s"+i);
            snow_yp[i] += snow_sty[i];
            snow_xp[i] += snow_stx[i];
            if (snow_yp[i] >= snow_browser_height + snow_size[i] || snow_xp[i] >= snow_browser_width - 3 * snow_size[i]) {
            snow_xp[i] = Math.random()*(snow_browser_width - snow_am[i]-30);
                    snow_yp[i] = 0;
                    snow_stx[i] = 0.02 + Math.random()/10;
                    snow_sty[i] = 0.7 + Math.random();
            snow_size[i] = Math.floor(this.state.snow_size_range * Math.random()) + snow_min_size;
            }
            snow_dx[i] += snow_stx[i];
            snowflake.style.wight = snow_size[i] + "px";
            snowflake.style.height = snow_size[i] + "px";
                snowflake.style.top = snow_yp[i] + "px";
                snowflake.style.left = snow_xp[i] + snow_am[i] * Math.sin(snow_dx[i]) + "px";
        }
        snow_time = setTimeout(this.startSnow, 10);
    }

    stopSnow(){
        for (let i = 0; i < snow_count; i++) {
            if (remove_snow_array_flag[i]) {
            let snowflake = document.getElementById("s"+i);
            snow_yp[i] += snow_sty[i];
            snow_xp[i] += snow_stx[i];
            if (snow_yp[i] >= snow_browser_height - 2 * snow_size[i] || snow_xp[i] >= snow_browser_width - 3 * snow_size[i]) {
                snowflake.parentNode.removeChild(snowflake);
                remove_snow_array_flag[i] = false;
            } else {
                snow_dx[i] += snow_stx[i];
                snowflake.style.wight = snow_size[i]+"px";
                snowflake.style.height = snow_size[i]+"px";
                    snowflake.style.top = snow_yp[i]+"px";
                    snowflake.style.left = snow_xp[i] + snow_am[i]*Math.sin(snow_dx[i])+"px";
            }
            }
        }
        if (!remove_snow_array_flag.every(function(item){return item === false})) {
            snow_time = setTimeout(this.stopSnow, 10);
        } else {
            logo.onmouseleave = null;
            logo.onmouseenter = this.flagUp;
        }
    }

    snow(){
        if (go_snow && snow_is_let === false) {
            snow_is_let = true;
            logo.onmouseenter = null;
            logo.onmouseleave = this.flagDown;
            this.drawSnowflake();
        }
    }

    flagUp() {
        snow_show = true;
        setTimeout(() => {
            if (snow_show && !(navigator.userAgent.search(/YaBrowser/) > 0)) {
                this.snow();
            }
        }, 2000)
    }

    flagDown(){
        snow_show = false;
        if (snow_is_let) {
                snow_is_let = false;
            this.stopSnow();
        }
    }

    render() {
        return(
            <Link className="logo" to="/">
                <img src={logo_img} alt="Логотип со слоганом"
                itemProp="image"
                id="logo"
    
                // onMouseOver={e => e.target.src = snow_logo}
                // onMouseOut={e => e.target.src = default_logo}
                />
            </Link>
        )
    }
};

export default Logo;
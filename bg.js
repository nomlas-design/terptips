!function(ze) {
    "use strict";
    ze.onload = function() {
        var t;
        var i;

        function r(e, n) {
            if (!function(e, n) {
                return null != n && "undefined" != typeof Symbol && n[Symbol.hasInstance] ? !!n[Symbol.hasInstance](e) : e instanceof n
            }(e, n))
                throw new TypeError("Cannot call a class as a function")
        }
        function o(e, n) {
            for (var r = 0; r < n.length; r++) {
                var t = n[r];
                t.enumerable = t.enumerable || !1,
                t.configurable = !0,
                "value"in t && (t.writable = !0),
                Object.defineProperty(e, t.key, t)
            }
        }
        function a(e, n, r) {
            return n && o(e.prototype, n),
            r && o(e, r),
            e
        }

        var u = document.getElementsByTagName("canvas")[0];
        ye();
        var l = {
            SIM_RESOLUTION: 128,
            DYE_RESOLUTION: 1024,
            CAPTURE_RESOLUTION: 512,
            DENSITY_DISSIPATION: 4,
            VELOCITY_DISSIPATION: 4,
            PRESSURE: .6,
            PRESSURE_ITERATIONS: 5,
            CURL: 30,
            SPLAT_RADIUS: .12,
            SPLAT_FORCE: 6e3,
            SHADING: !0,
            COLORFUL: 1,
            COLOR_UPDATE_SPEED: 30,
            PAUSED: !1,
            BACK_COLOR: {
                r: 0,
                g: 0,
                b: 0
            },
            TRANSPARENT: !1,
            BLOOM: !0,
            BLOOM_ITERATIONS: 8,
            BLOOM_RESOLUTION: 256,
            BLOOM_INTENSITY: 0.5,
            BLOOM_THRESHOLD: .6,
            BLOOM_SOFT_KNEE: .7,
            SUNRAYS: !0,
            SUNRAYS_RESOLUTION: 196,
            SUNRAYS_WEIGHT: 0.5
        };
        function f() {
            this.id = -1,
            this.texcoordX = 0,
            this.texcoordY = 0,
            this.prevTexcoordX = 0,
            this.prevTexcoordY = 0,
            this.deltaX = 0,
            this.deltaY = 0,
            this.down = !1,
            this.moved = !1,
            this.color = [30, 0, 300]
        }
        var v = []
          , c = [];
        v.push(new f);
        var m = function(e) {
            var n, r, t = {
                alpha: !0,
                depth: !1,
                stencil: !1,
                antialias: !1,
                preserveDrawingBuffer: !1
            }, i = e.getContext("webgl2", t), o = !!i;
            o || (i = e.getContext("webgl", t) || e.getContext("experimental-webgl", t));
            r = o ? (i.getExtension("EXT_color_buffer_float"),
            i.getExtension("OES_texture_float_linear")) : (n = i.getExtension("OES_texture_half_float"),
            i.getExtension("OES_texture_half_float_linear"));
            i.clearColor(0, 0, 0, 1);
            var a, u, f, v = o ? i.HALF_FLOAT : n.HALF_FLOAT_OES;
            f = o ? (a = h(i, i.RGBA16F, i.RGBA, v),
            u = h(i, i.RG16F, i.RG, v),
            h(i, i.R16F, i.RED, v)) : (a = h(i, i.RGBA, i.RGBA, v),
            u = h(i, i.RGBA, i.RGBA, v),
            h(i, i.RGBA, i.RGBA, v));
            return {
                gl: i,
                ext: {
                    formatRGBA: a,
                    formatRG: u,
                    formatR: f,
                    halfFloatTexType: v,
                    supportLinearFiltering: r
                }
            }
        }(u)
          , s = m.gl
          , d = m.ext;
        function h(e, n, r, t) {
            if (!function(e, n, r, t) {
                var i = e.createTexture();
                e.bindTexture(e.TEXTURE_2D, i),
                e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST),
                e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST),
                e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE),
                e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE),
                e.texImage2D(e.TEXTURE_2D, 0, n, 4, 4, 0, r, t, null);
                var o = e.createFramebuffer();
                return e.bindFramebuffer(e.FRAMEBUFFER, o),
                e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, i, 0),
                e.checkFramebufferStatus(e.FRAMEBUFFER) === e.FRAMEBUFFER_COMPLETE
            }(e, n, r, t))
                switch (n) {
                case e.R16F:
                    return h(e, e.RG16F, e.RG, t);
                case e.RG16F:
                    return h(e, e.RGBA16F, e.RGBA, t);
                default:
                    return null
                }
            return {
                internalFormat: n,
                format: r
            }
        }
        function T() {
            return /Mobi|Android/i.test(navigator.userAgent)
        }
        T() && (l.SIM_RESOLUTION = 64,
        l.DYE_RESOLUTION = 512),
        d.supportLinearFiltering || (l.DYE_RESOLUTION = 512,
        l.SHADING = !1,
        l.BLOOM = !1,
        l.SUNRAYS = !1);
        var g = (a(E, [{
            key: "setKeywords",
            value: function(e) {
                for (var n = 0, r = 0; r < e.length; r++)
                    n += Xe(e[r]);
                var t = this.programs[n];
                if (null == t) {
                    var i = D(s.FRAGMENT_SHADER, this.fragmentShaderSource, e);
                    t = p(this.vertexShader, i),
                    this.programs[n] = t
                }
                t !== this.activeProgram && (this.uniforms = S(t),
                this.activeProgram = t)
            }
        }, {
            key: "bind",
            value: function() {
                s.useProgram(this.activeProgram)
            }
        }]),
        E);
        function E(e, n) {
            r(this, E),
            this.vertexShader = e,
            this.fragmentShaderSource = n,
            this.programs = [],
            this.activeProgram = null,
            this.uniforms = []
        }
        var x = (a(R, [{
            key: "bind",
            value: function() {
                s.useProgram(this.program)
            }
        }]),
        R);
        function R(e, n) {
            r(this, R),
            this.uniforms = {},
            this.program = p(e, n),
            this.uniforms = S(this.program)
        }
        function p(e, n) {
            var r = s.createProgram();
            if (s.attachShader(r, e),
            s.attachShader(r, n),
            s.linkProgram(r),
            !s.getProgramParameter(r, s.LINK_STATUS))
                throw s.getProgramInfoLog(r);
            return r
        }
        function S(e) {
            for (var n = [], r = s.getProgramParameter(e, s.ACTIVE_UNIFORMS), t = 0; t < r; t++) {
                var i = s.getActiveUniform(e, t).name;
                n[i] = s.getUniformLocation(e, i)
            }
            return n
        }
        function D(e, n, r) {
            n = function(e, n) {
                if (null == n)
                    return e;
                var r = "";
                return n.forEach(function(e) {
                    r += "#define " + e + "\n"
                }),
                r + e
            }(n, r);
            var t = s.createShader(e);
            if (s.shaderSource(t, n),
            s.compileShader(t),
            !s.getShaderParameter(t, s.COMPILE_STATUS))
                throw s.getShaderInfoLog(t);
            return t
        }
        var A, _, y, L, U, b, F, w, O = D(s.VERTEX_SHADER, "\n    precision highp float;\n\n    attribute vec2 aPosition;\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform vec2 texelSize;\n\n    void main () {\n        vUv = aPosition * 0.5 + 0.5;\n        vL = vUv - vec2(texelSize.x, 0.0);\n        vR = vUv + vec2(texelSize.x, 0.0);\n        vT = vUv + vec2(0.0, texelSize.y);\n        vB = vUv - vec2(0.0, texelSize.y);\n        gl_Position = vec4(aPosition, 0.0, 1.0);\n    }\n"), N = D(s.VERTEX_SHADER, "\n    precision highp float;\n\n    attribute vec2 aPosition;\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    uniform vec2 texelSize;\n\n    void main () {\n        vUv = aPosition * 0.5 + 0.5;\n        float offset = 1.33333333;\n        vL = vUv - texelSize * offset;\n        vR = vUv + texelSize * offset;\n        gl_Position = vec4(aPosition, 0.0, 1.0);\n    }\n"), I = D(s.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    uniform sampler2D uTexture;\n\n    void main () {\n        vec4 sum = texture2D(uTexture, vUv) * 0.29411764;\n        sum += texture2D(uTexture, vL) * 0.35294117;\n        sum += texture2D(uTexture, vR) * 0.35294117;\n        gl_FragColor = sum;\n    }\n"), B = D(s.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    uniform sampler2D uTexture;\n\n    void main () {\n        gl_FragColor = texture2D(uTexture, vUv);\n    }\n"), M = D(s.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    uniform sampler2D uTexture;\n    uniform float value;\n\n    void main () {\n        gl_FragColor = value * texture2D(uTexture, vUv);\n    }\n"), P = D(s.FRAGMENT_SHADER, "\n    precision mediump float;\n\n    uniform vec4 color;\n\n    void main () {\n        gl_FragColor = color;\n    }\n"), C = D(s.FRAGMENT_SHADER, "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uTexture;\n    uniform float aspectRatio;\n\n    #define SCALE 25.0\n\n    void main () {\n        vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));\n        float v = mod(uv.x + uv.y, 2.0);\n        v = v * 0.1 + 0.8;\n        gl_FragColor = vec4(vec3(v), 1.0);\n    }\n"), X = D(s.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uTexture;\n    uniform vec3 curve;\n    uniform float threshold;\n\n    void main () {\n        vec3 c = texture2D(uTexture, vUv).rgb;\n        float br = max(c.r, max(c.g, c.b));\n        float rq = clamp(br - curve.x, 0.0, curve.y);\n        rq = curve.z * rq * rq;\n        c *= max(rq, br - threshold) / max(br, 0.0001);\n        gl_FragColor = vec4(c, 0.0);\n    }\n"), z = D(s.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform sampler2D uTexture;\n\n    void main () {\n        vec4 sum = vec4(0.0);\n        sum += texture2D(uTexture, vL);\n        sum += texture2D(uTexture, vR);\n        sum += texture2D(uTexture, vT);\n        sum += texture2D(uTexture, vB);\n        sum *= 0.25;\n        gl_FragColor = sum;\n    }\n"), G = D(s.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform sampler2D uTexture;\n    uniform float intensity;\n\n    void main () {\n        vec4 sum = vec4(0.0);\n        sum += texture2D(uTexture, vL);\n        sum += texture2D(uTexture, vR);\n        sum += texture2D(uTexture, vT);\n        sum += texture2D(uTexture, vB);\n        sum *= 0.25;\n        gl_FragColor = sum * intensity;\n    }\n"), Y = D(s.FRAGMENT_SHADER, "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uTexture;\n\n    void main () {\n        vec4 c = texture2D(uTexture, vUv);\n        float br = max(c.r, max(c.g, c.b));\n        c.a = 1.0 - min(max(br * 20.0, 0.0), 0.8);\n        gl_FragColor = c;\n    }\n"), H = D(s.FRAGMENT_SHADER, "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uTexture;\n    uniform float weight;\n\n    #define ITERATIONS 16\n\n    void main () {\n        float Density = 0.3;\n        float Decay = 0.95;\n        float Exposure = 0.7;\n\n        vec2 coord = vUv;\n        vec2 dir = vUv - 0.5;\n\n        dir *= 1.0 / float(ITERATIONS) * Density;\n        float illuminationDecay = 1.0;\n\n        float color = texture2D(uTexture, vUv).a;\n\n        for (int i = 0; i < ITERATIONS; i++)\n        {\n            coord -= dir;\n            float col = texture2D(uTexture, coord).a;\n            color += col * illuminationDecay * weight;\n            illuminationDecay *= Decay;\n        }\n\n        gl_FragColor = vec4(color * Exposure, 0.0, 0.0, 1.0);\n    }\n"), V = D(s.FRAGMENT_SHADER, "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uTarget;\n    uniform float aspectRatio;\n    uniform vec3 color;\n    uniform vec2 point;\n    uniform float radius;\n\n    void main () {\n        vec2 p = vUv - point.xy;\n        p.x *= aspectRatio;\n        vec3 splat = exp(-dot(p, p) / radius) * color;\n        vec3 base = texture2D(uTarget, vUv).xyz;\n        gl_FragColor = vec4(base + splat, 1.0);\n    }\n"), k = D(s.FRAGMENT_SHADER, "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uVelocity;\n    uniform sampler2D uSource;\n    uniform vec2 texelSize;\n    uniform vec2 dyeTexelSize;\n    uniform float dt;\n    uniform float dissipation;\n\n    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {\n        vec2 st = uv / tsize - 0.5;\n\n        vec2 iuv = floor(st);\n        vec2 fuv = fract(st);\n\n        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);\n        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);\n        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);\n        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);\n\n        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);\n    }\n\n    void main () {\n    #ifdef MANUAL_FILTERING\n        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;\n        vec4 result = bilerp(uSource, coord, dyeTexelSize);\n    #else\n        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;\n        vec4 result = texture2D(uSource, coord);\n    #endif\n        float decay = 1.0 + dissipation * dt;\n        gl_FragColor = result / decay;\n    }", d.supportLinearFiltering ? null : ["MANUAL_FILTERING"]), q = D(s.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    varying highp vec2 vL;\n    varying highp vec2 vR;\n    varying highp vec2 vT;\n    varying highp vec2 vB;\n    uniform sampler2D uVelocity;\n\n    void main () {\n        float L = texture2D(uVelocity, vL).x;\n        float R = texture2D(uVelocity, vR).x;\n        float T = texture2D(uVelocity, vT).y;\n        float B = texture2D(uVelocity, vB).y;\n\n        vec2 C = texture2D(uVelocity, vUv).xy;\n        if (vL.x < 0.0) { L = -C.x; }\n        if (vR.x > 1.0) { R = -C.x; }\n        if (vT.y > 1.0) { T = -C.y; }\n        if (vB.y < 0.0) { B = -C.y; }\n\n        float div = 0.5 * (R - L + T - B);\n        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);\n    }\n"), W = D(s.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    varying highp vec2 vL;\n    varying highp vec2 vR;\n    varying highp vec2 vT;\n    varying highp vec2 vB;\n    uniform sampler2D uVelocity;\n\n    void main () {\n        float L = texture2D(uVelocity, vL).y;\n        float R = texture2D(uVelocity, vR).y;\n        float T = texture2D(uVelocity, vT).x;\n        float B = texture2D(uVelocity, vB).x;\n        float vorticity = R - L - T + B;\n        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);\n    }\n"), K = D(s.FRAGMENT_SHADER, "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform sampler2D uVelocity;\n    uniform sampler2D uCurl;\n    uniform float curl;\n    uniform float dt;\n\n    void main () {\n        float L = texture2D(uCurl, vL).x;\n        float R = texture2D(uCurl, vR).x;\n        float T = texture2D(uCurl, vT).x;\n        float B = texture2D(uCurl, vB).x;\n        float C = texture2D(uCurl, vUv).x;\n\n        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));\n        force /= length(force) + 0.0001;\n        force *= curl * C;\n        force.y *= -1.0;\n\n        vec2 vel = texture2D(uVelocity, vUv).xy;\n        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);\n    }\n"), j = D(s.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    varying highp vec2 vL;\n    varying highp vec2 vR;\n    varying highp vec2 vT;\n    varying highp vec2 vB;\n    uniform sampler2D uPressure;\n    uniform sampler2D uDivergence;\n\n    void main () {\n        float L = texture2D(uPressure, vL).x;\n        float R = texture2D(uPressure, vR).x;\n        float T = texture2D(uPressure, vT).x;\n        float B = texture2D(uPressure, vB).x;\n        float C = texture2D(uPressure, vUv).x;\n        float divergence = texture2D(uDivergence, vUv).x;\n        float pressure = (L + R + B + T - divergence) * 0.25;\n        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);\n    }\n"), J = D(s.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    varying highp vec2 vL;\n    varying highp vec2 vR;\n    varying highp vec2 vT;\n    varying highp vec2 vB;\n    uniform sampler2D uPressure;\n    uniform sampler2D uVelocity;\n\n    void main () {\n        float L = texture2D(uPressure, vL).x;\n        float R = texture2D(uPressure, vR).x;\n        float T = texture2D(uPressure, vT).x;\n        float B = texture2D(uPressure, vB).x;\n        vec2 velocity = texture2D(uVelocity, vUv).xy;\n        velocity.xy -= vec2(R - L, T - B);\n        gl_FragColor = vec4(velocity, 0.0, 1.0);\n    }\n"), Q = (s.bindBuffer(s.ARRAY_BUFFER, s.createBuffer()),
        s.bufferData(s.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), s.STATIC_DRAW),
        s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, s.createBuffer()),
        s.bufferData(s.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), s.STATIC_DRAW),
        s.vertexAttribPointer(0, 2, s.FLOAT, !1, 0, 0),
        s.enableVertexAttribArray(0),
        function(e) {
            s.bindFramebuffer(s.FRAMEBUFFER, e),
            s.drawElements(s.TRIANGLES, 6, s.UNSIGNED_SHORT, 0)
        }
        ), Z = [], $ = function(e) {
            var n = s.createTexture();
            s.bindTexture(s.TEXTURE_2D, n),
            s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, s.LINEAR),
            s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, s.LINEAR),
            s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_S, s.REPEAT),
            s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_T, s.REPEAT),
            s.texImage2D(s.TEXTURE_2D, 0, s.RGB, 1, 1, 0, s.RGB, s.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));
            var r = {
                texture: n,
                width: 1,
                height: 1,
                attach: function(e) {
                    return s.activeTexture(s.TEXTURE0 + e),
                    s.bindTexture(s.TEXTURE_2D, n),
                    e
                }
            }
              , t = new Image;
            return t.onload = function() {
                r.width = t.width,
                r.height = t.height,
                s.bindTexture(s.TEXTURE_2D, n),
                s.texImage2D(s.TEXTURE_2D, 0, s.RGB, s.RGB, s.UNSIGNED_BYTE, t)
            }
            ,
            t.src = e,
            r
        }("img/LDR_LLL1_0.png"), ee = new x(N,I), ne = new x(O,B), re = new x(O,M), te = new x(O,P), ie = new x(O,C), oe = new x(O,X), ae = new x(O,z), ue = new x(O,G), fe = new x(O,Y), ve = new x(O,H), ce = new x(O,V), le = new x(O,k), me = new x(O,q), se = new x(O,W), de = new x(O,K), he = new x(O,j), Te = new x(O,J), ge = new g(O,"\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform sampler2D uTexture;\n    uniform sampler2D uBloom;\n    uniform sampler2D uSunrays;\n    uniform sampler2D uDithering;\n    uniform vec2 ditherScale;\n    uniform vec2 texelSize;\n\n    vec3 linearToGamma (vec3 color) {\n        color = max(color, vec3(0));\n        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));\n    }\n\n    void main () {\n        vec3 c = texture2D(uTexture, vUv).rgb;\n\n    #ifdef SHADING\n        vec3 lc = texture2D(uTexture, vL).rgb;\n        vec3 rc = texture2D(uTexture, vR).rgb;\n        vec3 tc = texture2D(uTexture, vT).rgb;\n        vec3 bc = texture2D(uTexture, vB).rgb;\n\n        float dx = length(rc) - length(lc);\n        float dy = length(tc) - length(bc);\n\n        vec3 n = normalize(vec3(dx, dy, length(texelSize)));\n        vec3 l = vec3(0.0, 0.0, 1.0);\n\n        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);\n        c *= diffuse;\n    #endif\n\n    #ifdef BLOOM\n        vec3 bloom = texture2D(uBloom, vUv).rgb;\n    #endif\n\n    #ifdef SUNRAYS\n        float sunrays = texture2D(uSunrays, vUv).r;\n        c *= sunrays;\n    #ifdef BLOOM\n        bloom *= sunrays;\n    #endif\n    #endif\n\n    #ifdef BLOOM\n        float noise = texture2D(uDithering, vUv * ditherScale).r;\n        noise = noise * 2.0 - 1.0;\n        bloom += noise / 255.0;\n        bloom = linearToGamma(bloom);\n        c += bloom;\n    #endif\n\n        float a = max(c.r, max(c.g, c.b));\n        gl_FragColor = vec4(c, a);\n    }\n");
        function Ee() {
            var e = Pe(l.SIM_RESOLUTION)
              , n = Pe(l.DYE_RESOLUTION)
              , r = d.halfFloatTexType
              , t = d.formatRGBA
              , i = d.formatRG
              , o = d.formatR
              , a = d.supportLinearFiltering ? s.LINEAR : s.NEAREST;
            A = null == A ? Re(n.width, n.height, t.internalFormat, t.format, r, a) : pe(A, n.width, n.height, t.internalFormat, t.format, r, a),
            _ = null == _ ? Re(e.width, e.height, i.internalFormat, i.format, r, a) : pe(_, e.width, e.height, i.internalFormat, i.format, r, a),
            y = xe(e.width, e.height, o.internalFormat, o.format, r, s.NEAREST),
            L = xe(e.width, e.height, o.internalFormat, o.format, r, s.NEAREST),
            U = Re(e.width, e.height, o.internalFormat, o.format, r, s.NEAREST),
            function() {
                var e = Pe(l.BLOOM_RESOLUTION)
                  , n = d.halfFloatTexType
                  , r = d.formatRGBA
                  , t = d.supportLinearFiltering ? s.LINEAR : s.NEAREST;
                b = xe(e.width, e.height, r.internalFormat, r.format, n, t);
                for (var i = Z.length = 0; i < l.BLOOM_ITERATIONS; i++) {
                    var o = e.width >> i + 1
                      , a = e.height >> i + 1;
                    if (o < 2 || a < 2)
                        break;
                    var u = xe(o, a, r.internalFormat, r.format, n, t);
                    Z.push(u)
                }
            }(),
            function() {
                var e = Pe(l.SUNRAYS_RESOLUTION)
                  , n = d.halfFloatTexType
                  , r = d.formatR
                  , t = d.supportLinearFiltering ? s.LINEAR : s.NEAREST;
                F = xe(e.width, e.height, r.internalFormat, r.format, n, t),
                w = xe(e.width, e.height, r.internalFormat, r.format, n, t)
            }()
        }
        function xe(e, n, r, t, i, o) {
            s.activeTexture(s.TEXTURE0);
            var a = s.createTexture();
            s.bindTexture(s.TEXTURE_2D, a),
            s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, o),
            s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, o),
            s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_S, s.CLAMP_TO_EDGE),
            s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_T, s.CLAMP_TO_EDGE),
            s.texImage2D(s.TEXTURE_2D, 0, r, e, n, 0, t, i, null);
            var u = s.createFramebuffer();
            return s.bindFramebuffer(s.FRAMEBUFFER, u),
            s.framebufferTexture2D(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, a, 0),
            s.viewport(0, 0, e, n),
            s.clear(s.COLOR_BUFFER_BIT),
            {
                texture: a,
                fbo: u,
                width: e,
                height: n,
                texelSizeX: 1 / e,
                texelSizeY: 1 / n,
                attach: function(e) {
                    return s.activeTexture(s.TEXTURE0 + e),
                    s.bindTexture(s.TEXTURE_2D, a),
                    e
                }
            }
        }
        function Re(e, n, r, t, i, o) {
            var a = xe(e, n, r, t, i, o)
              , u = xe(e, n, r, t, i, o);
            return {
                width: e,
                height: n,
                texelSizeX: a.texelSizeX,
                texelSizeY: a.texelSizeY,
                get read() {
                    return a
                },
                set read(e) {
                    a = e
                },
                get write() {
                    return u
                },
                set write(e) {
                    u = e
                },
                swap: function() {
                    var e = a;
                    a = u,
                    u = e
                }
            }
        }
        function pe(e, n, r, t, i, o, a) {
            return e.width === n && e.height === r || (e.read = function(e, n, r, t, i, o, a) {
                var u = xe(n, r, t, i, o, a);
                return ne.bind(),
                s.uniform1i(ne.uniforms.uTexture, e.attach(0)),
                Q(u.fbo),
                u
            }(e.read, n, r, t, i, o, a),
            e.write = xe(n, r, t, i, o, a),
            e.width = n,
            e.height = r,
            e.texelSizeX = 1 / n,
            e.texelSizeY = 1 / r),
            e
        }
        function Se() {
            var e = [];
            l.SHADING && e.push("SHADING"),
            l.BLOOM && e.push("BLOOM"),
            l.SUNRAYS && e.push("SUNRAYS"),
            ge.setKeywords(e)
        }
        Se(),
        Ee();

        var De = Date.now()
          , Ae = 0;
        function _e() {
            var e = Date.now()
              , n = (e - De) / 1e3;
            return n = Math.min(n, .016666),
            De = e,
            n
        }
        function ye() {
            var e = Ce(u.clientWidth)
              , n = Ce(u.clientHeight);
            return (u.width !== e || u.height !== n) && (u.width = e,
            u.height = n,
            !0)
        }
        function Le(e) {
            l.COLORFUL && 1 <= (Ae += e * l.COLOR_UPDATE_SPEED) && (Ae = function(e, n, r) {
                var t = r - n;
                return 0 != t ? (e - n) % t + n : n
            }(Ae, 0, 1),
            v.forEach(function(e) {
                e.color = Me()
            }))
        }
        function Ue() {
            0 < c.length && we(c.pop()),
            v.forEach(function(e) {
                e.moved && (e.moved = !1,
                function(e) {
                    var n = e.deltaX * l.SPLAT_FORCE
                      , r = e.deltaY * l.SPLAT_FORCE;
                    Oe(e.texcoordX, e.texcoordY, n, r, e.color)
                }(e))
            })
        }
        function be(e) {
            s.disable(s.BLEND),
            s.viewport(0, 0, _.width, _.height),
            se.bind(),
            s.uniform2f(se.uniforms.texelSize, _.texelSizeX, _.texelSizeY),
            s.uniform1i(se.uniforms.uVelocity, _.read.attach(0)),
            Q(L.fbo),
            de.bind(),
            s.uniform2f(de.uniforms.texelSize, _.texelSizeX, _.texelSizeY),
            s.uniform1i(de.uniforms.uVelocity, _.read.attach(0)),
            s.uniform1i(de.uniforms.uCurl, L.attach(1)),
            s.uniform1f(de.uniforms.curl, l.CURL),
            s.uniform1f(de.uniforms.dt, e),
            Q(_.write.fbo),
            _.swap(),
            me.bind(),
            s.uniform2f(me.uniforms.texelSize, _.texelSizeX, _.texelSizeY),
            s.uniform1i(me.uniforms.uVelocity, _.read.attach(0)),
            Q(y.fbo),
            re.bind(),
            s.uniform1i(re.uniforms.uTexture, U.read.attach(0)),
            s.uniform1f(re.uniforms.value, l.PRESSURE),
            Q(U.write.fbo),
            U.swap(),
            he.bind(),
            s.uniform2f(he.uniforms.texelSize, _.texelSizeX, _.texelSizeY),
            s.uniform1i(he.uniforms.uDivergence, y.attach(0));
            for (var n = 0; n < l.PRESSURE_ITERATIONS; n++)
                s.uniform1i(he.uniforms.uPressure, U.read.attach(1)),
                Q(U.write.fbo),
                U.swap();
            Te.bind(),
            s.uniform2f(Te.uniforms.texelSize, _.texelSizeX, _.texelSizeY),
            s.uniform1i(Te.uniforms.uPressure, U.read.attach(0)),
            s.uniform1i(Te.uniforms.uVelocity, _.read.attach(1)),
            Q(_.write.fbo),
            _.swap(),
            le.bind(),
            s.uniform2f(le.uniforms.texelSize, _.texelSizeX, _.texelSizeY),
            d.supportLinearFiltering || s.uniform2f(le.uniforms.dyeTexelSize, _.texelSizeX, _.texelSizeY);
            var r = _.read.attach(0);
            s.uniform1i(le.uniforms.uVelocity, r),
            s.uniform1i(le.uniforms.uSource, r),
            s.uniform1f(le.uniforms.dt, e),
            s.uniform1f(le.uniforms.dissipation, l.VELOCITY_DISSIPATION),
            Q(_.write.fbo),
            _.swap(),
            s.viewport(0, 0, A.width, A.height),
            d.supportLinearFiltering || s.uniform2f(le.uniforms.dyeTexelSize, A.texelSizeX, A.texelSizeY),
            s.uniform1i(le.uniforms.uVelocity, _.read.attach(0)),
            s.uniform1i(le.uniforms.uSource, A.read.attach(1)),
            s.uniform1f(le.uniforms.dissipation, l.DENSITY_DISSIPATION),
            Q(A.write.fbo),
            A.swap()
        }
        function Fe(e) {
            l.BLOOM && function(e, n) {
                if (Z.length < 2)
                    return;
                var r = n;
                s.disable(s.BLEND),
                oe.bind();
                var t = l.BLOOM_THRESHOLD * l.BLOOM_SOFT_KNEE + 1e-4
                  , i = l.BLOOM_THRESHOLD - t
                  , o = 2 * t
                  , a = .25 / t;
                s.uniform3f(oe.uniforms.curve, i, o, a),
                s.uniform1f(oe.uniforms.threshold, l.BLOOM_THRESHOLD),
                s.uniform1i(oe.uniforms.uTexture, e.attach(0)),
                s.viewport(0, 0, r.width, r.height),
                Q(r.fbo),
                ae.bind();
                for (var u = 0; u < Z.length; u++) {
                    var f = Z[u];
                    s.uniform2f(ae.uniforms.texelSize, r.texelSizeX, r.texelSizeY),
                    s.uniform1i(ae.uniforms.uTexture, r.attach(0)),
                    s.viewport(0, 0, f.width, f.height),
                    Q(f.fbo),
                    r = f
                }
                s.blendFunc(s.ONE, s.ONE),
                s.enable(s.BLEND);
                for (var v = Z.length - 2; 0 <= v; v--) {
                    var c = Z[v];
                    s.uniform2f(ae.uniforms.texelSize, r.texelSizeX, r.texelSizeY),
                    s.uniform1i(ae.uniforms.uTexture, r.attach(0)),
                    s.viewport(0, 0, c.width, c.height),
                    Q(c.fbo),
                    r = c
                }
                s.disable(s.BLEND),
                ue.bind(),
                s.uniform2f(ue.uniforms.texelSize, r.texelSizeX, r.texelSizeY),
                s.uniform1i(ue.uniforms.uTexture, r.attach(0)),
                s.uniform1f(ue.uniforms.intensity, l.BLOOM_INTENSITY),
                s.viewport(0, 0, n.width, n.height),
                Q(n.fbo)
            }(A.read, b),
            l.SUNRAYS && (function(e, n, r) {
                s.disable(s.BLEND),
                fe.bind(),
                s.uniform1i(fe.uniforms.uTexture, e.attach(0)),
                s.viewport(0, 0, n.width, n.height),
                Q(n.fbo),
                ve.bind(),
                s.uniform1f(ve.uniforms.weight, l.SUNRAYS_WEIGHT),
                s.uniform1i(ve.uniforms.uTexture, n.attach(0)),
                s.viewport(0, 0, r.width, r.height),
                Q(r.fbo)
            }(A.read, A.write, F),
            function(e, n, r) {
                ee.bind();
                for (var t = 0; t < r; t++)
                    s.uniform2f(ee.uniforms.texelSize, e.texelSizeX, 0),
                    s.uniform1i(ee.uniforms.uTexture, e.attach(0)),
                    Q(n.fbo),
                    s.uniform2f(ee.uniforms.texelSize, 0, e.texelSizeY),
                    s.uniform1i(ee.uniforms.uTexture, n.attach(0)),
                    Q(e.fbo)
            }(F, w, 1)),
            null != e && l.TRANSPARENT ? s.disable(s.BLEND) : (s.blendFunc(s.ONE, s.ONE_MINUS_SRC_ALPHA),
            s.enable(s.BLEND));
            var n = null == e ? s.drawingBufferWidth : e.width
              , r = null == e ? s.drawingBufferHeight : e.height;
            s.viewport(0, 0, n, r);
            var t = null == e ? null : e.fbo;
            l.TRANSPARENT || function(e, n) {
                te.bind(),
                s.uniform4f(te.uniforms.color, n.r, n.g, n.b, 1),
                Q(e)
            }(t, function(e) {
                return {
                    r: e.r / 255,
                    g: e.g / 255,
                    b: e.b / 255
                }
            }(l.BACK_COLOR)),
            null == e && l.TRANSPARENT && function(e) {
                ie.bind(),
                s.uniform1f(ie.uniforms.aspectRatio, u.width / u.height),
                Q(e)
            }(t),
            function(e, n, r) {
                ge.bind(),
                l.SHADING && s.uniform2f(ge.uniforms.texelSize, 1 / n, 1 / r);
                if (s.uniform1i(ge.uniforms.uTexture, A.read.attach(0)),
                l.BLOOM) {
                    s.uniform1i(ge.uniforms.uBloom, b.attach(1)),
                    s.uniform1i(ge.uniforms.uDithering, $.attach(2));
                    var t = function(e, n, r) {
                        return {
                            x: n / e.width,
                            y: r / e.height
                        }
                    }($, n, r);
                    s.uniform2f(ge.uniforms.ditherScale, t.x, t.y)
                }
                l.SUNRAYS && s.uniform1i(ge.uniforms.uSunrays, F.attach(3));
                Q(e)
            }(t, n, r)
        }
        function we(e) {
            for (var n = 0; n < e; n++) {
                var r = Me();
                r.r *= 10,
                r.g *= 10,
                r.b *= 10,
                Oe(Math.random(), Math.random(), 1e3 * (Math.random() - .5), 1e3 * (Math.random() - .5), r)
            }
        }
        function Oe(e, n, r, t, i) {
            s.viewport(0, 0, _.width, _.height),
            ce.bind(),
            s.uniform1i(ce.uniforms.uTarget, _.read.attach(0)),
            s.uniform1f(ce.uniforms.aspectRatio, u.width / u.height),
            s.uniform2f(ce.uniforms.point, e, n),
            s.uniform3f(ce.uniforms.color, r, t, 0),
            s.uniform1f(ce.uniforms.radius, function(e) {
                var n = u.width / u.height;
                1 < n && (e *= n);
                return e
            }(l.SPLAT_RADIUS / 100)),
            Q(_.write.fbo),
            _.swap(),
            s.viewport(0, 0, A.width, A.height),
            s.uniform1i(ce.uniforms.uTarget, A.read.attach(0)),
            s.uniform3f(ce.uniforms.color, i.r, i.g, i.b),
            Q(A.write.fbo),
            A.swap()
        }
        function Ne(e, n, r, t) {
            e.id = n,
            e.down = !0,
            e.moved = !1,
            e.texcoordX = r / u.width,
            e.texcoordY = 1 - t / u.height,
            e.prevTexcoordX = e.texcoordX,
            e.prevTexcoordY = e.texcoordY,
            e.deltaX = 0,
            e.deltaY = 0,
            e.color = Me()
        }
        function Ie(e, n, r) {
            e.prevTexcoordX = e.texcoordX,
            e.prevTexcoordY = e.texcoordY,
            e.texcoordX = n / u.width,
            e.texcoordY = 1 - r / u.height,
            e.deltaX = function(e) {
                var n = u.width / u.height;
                n < 1 && (e *= n);
                return e
            }(e.texcoordX - e.prevTexcoordX),
            e.deltaY = function(e) {
                var n = u.width / u.height;
                1 < n && (e /= n);
                return e
            }(e.texcoordY - e.prevTexcoordY),
            e.moved = 0 < Math.abs(e.deltaX) || 0 < Math.abs(e.deltaY)
        }
        function Be(e) {
            e.down = !1
        }
        function Me() {
            var e = function(e, n, r) {
                var t, i, o, a, u, f, v, c;
                switch (a = Math.floor(2 * e),
                f = r * (1 - n),
                v = r * (1 - (u = 6 * e - a) * n),
                c = r * (1 - (1 - u) * n),
                a % 6) {
                case 0:
                    t = 2,
                    i = 3,
                    o = 2;
                    break;
                case 1:
                    t = 3,
                    i = 6,
                    o = 2;
                    break;
                case 2:
                    t = 4,
                    i = 5,
                    o = 2
                }
                return {
                    r: t,
                    g: i,
                    b: o
                }
            }(Math.random(), 1, 1);
            return e.r *= .01,
            e.g *= .01,
            e.b *= .01,
            e
        }
        function Pe(e) {
            var n = s.drawingBufferWidth / s.drawingBufferHeight;
            n < 1 && (n = 1 / n);
            var r = Math.round(e)
              , t = Math.round(e * n);
            return s.drawingBufferWidth > s.drawingBufferHeight ? {
                width: t,
                height: r
            } : {
                width: r,
                height: t
            }
        }
        function Ce(e) {
            var n = ze.devicePixelRatio || 1;
            return Math.floor(e * n)
        }
        function Xe(e) {
            if (0 === e.length)
                return 0;
            for (var n = 0, r = 0; r < e.length; r++)
                n = (n << 5) - n + e.charCodeAt(r),
                n |= 0;
            return n
        }
        !function e() {
            var n = _e();
            ye() && Ee();
            Le(n);
            Ue();
            l.PAUSED || be(n);
            Fe(null);
            requestAnimationFrame(e)
        }(),
        u.addEventListener("mouseenter", function(e) {
            var n = Ce(e.offsetX)
              , r = Ce(e.offsetY)
              , t = v.find(function(e) {
                return -1 === e.id
            });
            null == t && (t = new f),
            Ne(t, -1, n, r)
        }),
        u.addEventListener("mousemove", function(e) {
            var n = v[0];
            n.down && Ie(n, Ce(e.offsetX), Ce(e.offsetY))
        }),
        u.addEventListener("mouseleave", function() {
            Be(v[0])
        }),
        u.addEventListener("touchstart", function(e) {
            e.preventDefault();
            for (var n = e.targetTouches; n.length >= v.length; )
                v.push(new f);
            for (var r = 0; r < n.length; r++) {
                var t = Ce(n[r].pageX)
                  , i = Ce(n[r].pageY);
                Ne(v[r + 1], n[r].identifier, t, i)
            }
        }),
        u.addEventListener("touchmove", function(e) {
            e.preventDefault();
            for (var n = e.targetTouches, r = 0; r < n.length; r++) {
                var t = v[r + 1];
                if (t.down)
                    Ie(t, Ce(n[r].pageX), Ce(n[r].pageY))
            }
        }, !1),
        ze.addEventListener("touchend", function(e) {
            for (var r = e.changedTouches, n = function(n) {
                var e = v.find(function(e) {
                    return e.id === r[n].identifier
                });
                if (null == e)
                    return "continue";
                Be(e)
            }, t = 0; t < r.length; t++)
                n(t)
        }),
        ze.addEventListener("keydown", function(e) {
            " " === e.key && c.push(parseInt(20 * Math.random()) + 5)
        })
    }
}(window);

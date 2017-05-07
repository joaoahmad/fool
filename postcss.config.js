module.exports = {
    sourceMap: true,
    plugins: function () {
        return [
            require('postcss-color-function'),
            require('postcss-modules-extract-imports'),
            require('autoprefixer')({ browser: '> 5%' }),
            // cssnano({
            //     discardComments : {
            //         removeAll : true
            //     },
            //     discardUnused : false,
            //     mergeIdents   : false,
            //     reduceIdents  : false,
            //     safe          : true,
            //     sourcemap     : true
            // })
        ];
    }
}


//-------------------------INPUT PREPROCESSING--------------------------
var sentence = "Halo bot, tolong ingetin, kalo ada kuis string matching if2230 tanggal 22/03/2021 topiknya bab 2 sampai 3"
sentence = sentence.toLowerCase().replace(/\./, '');

//-------------------------REGEX DEFINITIONS--------------------------


//-------------------------REGEX UTILITIES--------------------------
var thisregexutils = {
    //Regular expressions
    re_tgl: /((0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012]])[/](20\d\d))+/g,
    re_ndepan: /((\\d?)\s?(hari|minggu)\s.*depan)/, //indeks 3: n ('' = 1), indeks 4: hari/minggu
    re_besok: /(besok+)/g,
    re_today: /(hari\sini+)/g,

    //Jenis
    re_jenis: /(tubes|tucil|kuis|praktikum|uas|uts|deadline)/g,

    //Kode
    re_kode: /(\w+\d\d\d\d)/g,

    //Topik
    re_topiklast: /(tentang|topik(nya)*|materi(nya)*)\s(.*?)$/i, //Ambil indeks 4 saja
    re_topik: /(tentang|topik(nya)*|materi(nya)*)\s(.*?)\s(pada|buat|untuk|tanggal)/i, //Ambil indeks 4 saja

    re_topikkodelast: /if\d\d\d\ds(.*?)$/i, //Ambil indeks 1 saja
    re_topikkode: /if\d\d\d\d\s(.*?)\s(pada|buat|untuk|tanggal)/i, //Ambil indeks 1 saja

    re_topikjenislast: /(tubes|tucil|kuis|praktikum|uas|uts)\s(.*?)$/i, //Ambil indeks 2 saja
    re_topikjenis: /(tubes|tucil|kuis|praktikum|uas|uts)\s(.*?)\s(pada|buat|untuk|tanggal)/i, //Ambil indeks 2 saja

    re_topikjeniskode: /(tubes|tucil|kuis|praktikum|uas|uts)\s(.*?)\s(if\d\d\d\d)/i, //Ambil indeks 2 saja

    //Question
    re_q: /(\?)/g,

    //Task
    re_taskdone: /(?=.*task\s(\d))(?=.*(selesai))/,
    re_taskmod: /(?=.*task\s(\d))(?=.*(ubah|undur|maju))/,

    //Regex read
    read_jenis: [],
    read_kode: [],
    read_topik: [],
    read_tgl: [],
    read_taskdone: [],
    read_taskmod: [],
    read_q: [],


    regex_topik(sentence) {
        //Fungsi utilitas untuk menentukan topik dari input
        result = []
        var raw = sentence.match(re_topik)
        if (raw !== null) {
            return [raw[4]];
        }
    
        raw = sentence.match(re_topiklast)
        if (raw !== null) {
            return [raw[4]];
        }
    
        raw = sentence.match(re_topikkode)
        if (raw !== null) {
            return [raw[1]];
        }
    
        raw = sentence.match(re_topikkodelast)
        if (raw !== null) {
            return [raw[1]];
        }
    
        raw = sentence.match(re_topikjenis)
        if (raw !== null) {
            return [raw[2]];
        }
    
        raw = sentence.match(re_topikjenislast)
        if (raw !== null) {
            return [raw[2]];
        }
    
        raw = sentence.match(re_topikjeniskode)
        if (raw !== null) {
            return [raw[2]];
        }
    
    },
    
    date_pushback(n) {
        //Fungsi utilitas untuk menentukan tanggal + n dari current date
        var newDate = new Date();
        newDate.setDate(new Date().getDate()+n);
        
        var dd = String(newDate.getDate()).padStart(2, '0');
        var mm = String(newDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = newDate.getFullYear();
    
        var result = dd + '/' + mm + '/' + yyyy;
        return result;
        
    },
    
    regex_date(sentence) {
        //Fungsi utilitas untuk menentukan tanggal dari input
        result = [];
    
        if (sentence.match(re_today) !== null) {
            result.push(date_pushback(0));
    
        } else if (sentence.match(re_besok) !== null) {
            result.push(tomordate_pushback(1));
    
        } else if (sentence.match(re_ndepan) !== null) {
            temp = sentence.match(re_ndepan);
            if (temp[3] === "minggu") {
                result.push(date_pushback(0));
                result.push(date_pushback(temp[2]*7));
            } else if (temp[3] === "hari") {
                result.push(date_pushback(0));
                result.push(date_pushback(temp[2]));
            }
        } else if (sentence.match(re_tgl) !== null) {
            read_tgl = sentence.match(re_tgl);
            if (read_tgl.length === 2) {
                result = read_tgl;
            } else {
                result.push(read_tgl[0]);
            }
        }
    
        //Return
        if (result.length === 0) {
            return null;
        }
        return result;
        
    },

    generate_id() {
        return 1;
    },

    //INTENTS
    //Intent 1 - menambah task
    //Komposisi: jenis, kode, tanggal, topik    
    add_task() {
        //prep
        read_kode[0] = read_kode[0].toUpperCase();
        read_topik[0] = read_topik[0].charAt(0).toUpperCase() + read_topik[0].slice(1);
        read_jenis[0] = read_jenis[0].charAt(0).toUpperCase() + read_jenis[0].slice(1);

        let line1 = "[TASK BERHASIL DICATAT]";
        id = generate_id();

        let line2 = (`(ID: ${id}) ${read_tgl[0]} - ${read_kode[0]} - ${read_jenis[0]} - ${read_topik[0]}`);

        //Query buat masukin ke database

        //DEBUG
        // console.log(line1);
        // console.log(line2);
        return (line2);
    },


    //Intent 2 - Daftar deadline tanggal
    //Komposisi: jenis, tanggal*, ?
    list_task_tgl() {
        let tanggal1 = read_tgl[0];
        if (read_tgl.length === 2) {
            let tanggal2 = read_tgl[1];
        }

        //query buat ngambil semua task antara dua tanggal

        //DEBUG
        // console.log("Masuk list_task_tgl");
        // console.log(tanggal1);
        return("Masuk list_task_tgl");
    },

    //Intent 3 - Menampilkan deadline tugas
    //Komposisi: jenis (deadline) -> semua task, ?
    list_task_kd() {

        //query buat ngambil

        //DEBUG
        // console.log("Masuk list_task_kd");
        return("Masuk list_task_kd");
    },


    //Intent 4 - Memperbaharui tanggal deadline
    //Komposisi: notask, diundur|diubah
    update_task() {

        let tgl_new = read_tgl[read_tgl.length - 1];
        let no_task = read_taskmod[1];

        //query update di database

        //DEBUG
        // console.log(no_task);
        // console.log(tgl_new);
        // console.log("Masuk update_task");
        return("Masuk update_task");
    },


    //Intent 5 - Menyelesaikan tugas
    //Kompoksisi: notask, selesai
    finish_task() {

        let no_task = read_taskdone[1];
        //query delete task dari database

        //DEBUG
        return("Masuk finish_task");
    },


    //INTENT MANAGER
    asisstant_manager() {
        if (read_jenis !== null && read_kode !== null &&
            read_tgl !== null && read_topik !== null &&
            read_q === null) {
                return (add_task());

        } else if (read_jenis !== null && read_q !== null &&
            read_tgl !== null && read_kode === null) {
                return(list_task_tgl());

        } else if (read_jenis !== null && read_q !== null &&
            read_tgl === null && read_kode !== null) {
                return(list_task_kd());

        } else if (read_taskmod !== null && read_tgl !== null) {
            return(update_task());

        } else if (read_taskdone !== null) {
            return(finish_task());

        } else {
            return("Ga ada command");
        }
    }

}


//-------------------------REGEX ASSIGNMENT--------------------------
var read_jenis = sentence.match(re_jenis);
var read_kode = sentence.match(re_kode);
var read_topik = regex_topik(sentence);
var read_tgl = regex_date(sentence);
var read_taskdone = sentence.match(re_taskdone);
var read_taskmod = sentence.match(re_taskmod);
var read_q = sentence.match(re_q);

//DEBUG
// console.log(read_jenis);
// console.log(read_kode);
// console.log(read_tgl);
// console.log(read_topik);
// console.log(read_taskdone);
// console.log(read_taskmod);
// console.log(read_q);


//MAIN
//nerima input
//regex declaration based on input
//asisstant amnager

export default regexutils; 

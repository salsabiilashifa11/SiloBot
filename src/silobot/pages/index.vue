<template>
    <div class="page-content">
        <img
            src="Logo-1.png"
            class="image-hero"
            alt=""
        />
        <div class="chat-box">
            <div class="chat-box-list-container" id="chatbox">
                <ul class="chat-box-list">
                    <li 
                        class="message"
                        v-for="(message, idx) in messages"
                        :key="idx"
                        :class="message.author"
                    >
                        <p>{{message.text}}</p>
                    </li>
                </ul>
            </div>
            <div class="chat-inputs">
                <input placeholder="Enter a message" class="text-input" type="text" v-model="message" @keyup.enter="sendMessage"/>
                <button @click="sendMessage">Send</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : "home",
    data : () => ({
        message:'',
        messages:[{
                    text: `Halo, Namaku Silobot. Aku adalah Deadline Reminder Assistant. Apa yang bisa Aku Bantu?
                    
                    Tanya \"bisa apa\" untuk mengetahui fitur yang dapat Aku lakukan dan daftar kata penting yang Aku kenali.
                    Contoh: "Silobot bisa ngapain aja?"`,
                    author: "silobot"
                }],
        // Kalo kata penting kurang tambahin aja
        kataPenting: ["Kuis", "Ujian", "Tucil", "Tubes", "Praktikum", "Tugas", "Deadline"],

        //Regex
        re_tgl: /((\d\d)[/](\d\d)[/](20\d\d))+/g,
        re_ndepan: /((\d?)\s?(hari|minggu))/,
        // re_ndepan: /((\d?)\s?(hari|minggu)\s.*depan)/, //indeks 3: n ('' = 1), indeks 4: hari/minggu
        re_besok: /(besok+)/g,
        re_today: /(hari\sini+)/g,

        //Jenis
        re_jenis: /(tubes|tucil|kuis|praktikum|ujian|deadline)/g,

        //Kode
        re_kode: /(\w+\d\d\d\d)/g,

        //Topik Ingetin yaa, tubes IF2212 harus tentang algoritma greedy dikumpulin tanggal 28/09/2021
        re_topiklast: /(tentang|topik(nya)*|materi(nya)*)\s(.*?)$/i, //Ambil indeks 4 saja
        re_topik: /(tentang|topik(nya)*|materi(nya)*)\s(.*?)\s(pada|buat|untuk|tanggal|dikumpulin|harus)/i, //Ambil indeks 4 saja

        re_topikkodelast: /if\d\d\d\ds(.*?)$/i, //Ambil indeks 1 saja
        re_topikkode: /if\d\d\d\d\s(.*?)\s(pada|buat|untuk|tanggal|dikumpulin|harus)/i, //Ambil indeks 1 saja

        re_topikjenislast: /(tubes|tucil|kuis|praktikum|ujian)\s(.*?)$/i, //Ambil indeks 2 saja
        re_topikjenis: /(tubes|tucil|kuis|praktikum|ujian)\s(.*?)\s(pada|buat|untuk|tanggal|dikumpulin|harus)/i, //Ambil indeks 2 saja

        re_topikjeniskode: /(tubes|tucil|kuis|praktikum|ujian)\s(.*?)\s(if\d\d\d\d)/i, //Ambil indeks 2 saja

        re_help: /((?=.*apa(in)*)(?=.*bisa))/i,

        //Question
        re_q: /(\?)/g,

        //Task
        re_taskdone: /(?=.*task\s(\d*))(?=.*(selesai))/i,
        re_taskmod: /(?=.*task\s(\d*))(?=.*(ubah|undur|maju|ganti|jadi))/i,

        //Regex read
        read_jenis: [],
        read_kode: [],
        read_topik: [],
        read_tgl: [],
        read_taskdone: [],
        read_taskmod: [],
        read_q: [],
        read_help: []

        // Data tugasnya masukin sini aja habis di fetch

        
    }),
    methods: {

        regex_topik(sentence) {
            //Fungsi utilitas untuk menentukan topik dari input
            var result = []
            var raw = sentence.match(this.re_topik)
            if (raw !== null) {
                return [raw[4]];
            }
        
            raw = sentence.match(this.re_topiklast)
            if (raw !== null) {
                return [raw[4]];
            }
        
            raw = sentence.match(this.re_topikkode)
            if (raw !== null) {
                return [raw[1]];
            }
        
            raw = sentence.match(this.re_topikkodelast)
            if (raw !== null) {
                return [raw[1]];
            }
        
            raw = sentence.match(this.re_topikjenis)
            if (raw !== null) {
                return [raw[2]];
            }
        
            raw = sentence.match(this.re_topikjenislast)
            if (raw !== null) {
                return [raw[2]];
            }
        
            raw = sentence.match(this.re_topikjeniskode)
            if (raw !== null) {
                return [raw[2]];
            }
        
        },
        
        date_pushback(n) {
            //Fungsi utilitas untuk menentukan tanggal + n dari current date


            var newDate = new Date();
            newDate.setDate(new Date().getDate()+ parseInt(n));
            
            var dd = String(newDate.getDate()).padStart(2, '0');
            var mm = String(newDate.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = newDate.getFullYear();
        
            var result = dd + '/' + mm + '/' + yyyy;
            return result;
            
        },
        
        regex_date(sentence) {
            
            //Fungsi utilitas untuk menentukan tanggal dari input
            var result = [];
            console.log("hasil: "+ sentence.match(this.re_ndepan));
            if (sentence.match(this.re_today) !== null) {
                result.push(this.date_pushback(0));
        
            } else if (sentence.match(this.re_besok) !== null) {
                result.push(this.date_pushback(1));
        
            } else if (sentence.match(this.re_ndepan) !== null) {
                console.log("masuk 1");
                var temp = sentence.match(this.re_ndepan);
                if (temp[3] === "minggu") {
                    result.push(this.date_pushback(0));
                    result.push(this.date_pushback(temp[2]*7));
                } else if (temp[3] === "hari") {
                    result.push(this.date_pushback(0));
                    result.push(this.date_pushback(temp[2]));
                }
            } else if (sentence.match(this.re_tgl) !== null) {
                this.read_tgl = sentence.match(this.re_tgl);
                if (this.read_tgl.length === 2) {
                    result = this.read_tgl;
                } else {
                    result.push(this.read_tgl[0]);
                }
            }
        
            //Return
            if (result.length === 0) {
                return null;
            }
            return result;
            
        },



        KMP(s, w) {
            var m = 0, i = 0, 
                pos, cnd, t,
                slen = s.length,
                wlen = w.length;
            
            s = s.split("");
            w = w.split("");    
                    
            t = [-1, 0];
            for ( pos = 2, cnd = 0; pos < wlen; ) {
                if ( w[pos-1] === w[cnd] ) {
                    t[pos] = cnd + 1;
                    pos++; cnd++;
                }
                else if ( cnd > 0 )
                cnd = t[cnd];
                else 
                t[pos++] = 0;
            } 
            
            while ( m + i < slen ) {
                if ( s[m+i] === w[i] ) {
                    i++;
                    if ( i === wlen ) 
                    return m;
                }
                else {
                    m += i - t[i];
                    if ( t[i] > -1 ) 
                        i = t[i];
                    else
                        i = 0;
                }
            }
            return -1;
        },

        findKataPenting(sentence) {
            var i, j;
            sentence = sentence.toLowerCase();
            sentence = sentence.replace(/\./, '');
            var in_arr = this.message.split(" ");
            for (i = 0; i < this.kataPenting.length; i++) {
                // console.log("Yo: " + this.KMP(sentence, this.kataPenting[0]));
                var hasil = this.KMP(sentence, this.kataPenting[i].toLowerCase());
                if (hasil !== -1) {
                    return [this.kataPenting[i]]; 
                }
            }
            for (i = 0; i < in_arr.length; i++) {
                for (j = 0; j < this.kataPenting.length; j++) {
                    if (this.levenshteinDistance(in_arr[i], this.kataPenting[j].toLowerCase()) <= 2) {
                        this.messages.push({
                        text: `Apakah maksudmu ${this.kataPenting[j]}?`,
                        author: "silobot"
                        })
                        return [this.kataPenting[j]]
                    }
                }
                
            }
            return null;
            
        },

        distance(a, b){
            if(a.length == 0) return b.length; 
            if(b.length == 0) return a.length; 

            var matrix = [];

            // increment along the first column of each row
            var i;
            for(i = 0; i <= b.length; i++){
                matrix[i] = [i];
            }

            // increment each column in the first row
            var j;
            for(j = 0; j <= a.length; j++){
                matrix[0][j] = j;
            }

            // Fill in the rest of the matrix
            for(i = 1; i <= b.length; i++){
                for(j = 1; j <= a.length; j++){
                    if(b.charAt(i-1) == a.charAt(j-1)){
                        matrix[i][j] = matrix[i-1][j-1];
                    } else {
                        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                        Math.min(matrix[i][j-1] + 1, // insertion
                                        matrix[i-1][j] + 1)); // deletion
                    }
                }
            }

            return matrix[b.length][a.length];
        },

        levenshteinDistance(a, b){

            let m = a.length;
            let n = b.length;

            if(m == 0) { return n; }
            if(n == 0) { return m; }
        
            var matrix = [];
        
            // increment along the first column of each row
            var i;
            for(i = 0; i < n+1; i++){
                matrix[i] = [i];
            }

            // increment each column in the first row
            var j;
            for(j = 0; j < m+1; j++){
                matrix[0][j] = j;
            }
        
            // Fill in the rest of the matrix
            for(i = 1; i < n+1; i++){
                for(j = 1; j < m+1; j++){
                    if(b.charAt(i-1) == a.charAt(j-1)){
                        matrix[i][j] = matrix[i-1][j-1];
                    } else {
                        matrix[i][j] = this.min(matrix[i-1][j-1] + 1, // substitution
                                        this.min(matrix[i][j-1] + 1, // insertion
                                        matrix[i-1][j] + 1)); // deletion
                    }
                }
            }
        
            return matrix[n][m];
        },

        min(a, b) {
            if (a < b) {
                return a;
            }
            return b;
        },   

        generate_id() {
            return 1;
        },

        //INTENTS
        //Intent 1 - menambah task
        //Komposisi: jenis, kode, tanggal, topik    
        add_task() {
            //prep
            this.read_kode[0] = this.read_kode[0].toUpperCase();
            this.read_topik[0] = this.read_topik[0].charAt(0).toUpperCase() + this.read_topik[0].slice(1);
            this.read_jenis[0] = this.read_jenis[0].charAt(0).toUpperCase() + this.read_jenis[0].slice(1);

            var dl = this.read_tgl[0].split("/")
            var deadline = `${dl[2]}-${dl[1]}-${dl[0]}`
            // var line2 = (`(ID: ${id}) ${this.read_tgl[0]} - ${this.read_kode[0]} - ${this.read_jenis[0]} - ${this.read_topik[0]}`);

            //Query buat masukin ke database
            this.createNewTask(deadline, this.read_kode[0], this.read_jenis[0], this.read_topik[0])
                .then(res => this.messages.push({
                    text: `[TASK BERHASIL DICATAT]
                    (ID: ${res.id}) ${this.read_tgl[0]} - ${this.read_kode[0]} - ${this.read_jenis[0]} - ${this.read_topik[0]}`,
                    author: "silobot"
                }));
            
        },


        //Intent 2 - Daftar deadline tanggal
        //Komposisi: jenis, tanggal*, ?
        list_task_tgl() {
            var tanggal1 = this.read_tgl[0];
            var tanggal2 = this.read_tgl[0];
            console.log(this.read_tgl);
            if (this.read_tgl.length === 2) {
                tanggal2 = this.read_tgl[1];
            }

            //reformat tanggal
            tanggal1 = this.reformat_tanggal(tanggal1);
            tanggal2 = this.reformat_tanggal(tanggal2);

            //query buat ngambil semua task antara dua tanggal
            if (this.read_jenis[0] !== "Deadline") {
                this.getTaskByTimeAndType(this.read_jenis[0], tanggal1, tanggal2)
                    .then(res => this.tasksFormatter(res))
                    .then(res => this.messages.push({
                    text: res,
                    author: "silobot"
                    }))
            } else {
                this.getTaskByTimePeriod(tanggal1, tanggal2)
                    .then(res => this.tasksFormatter(res))
                    .then(res => this.messages.push({
                    text: res,
                    author: "silobot"
                    }))
            }
            
            //DEBUG
            // console.log("Masuk list_task_tgl");
            // console.log(tanggal1);
            // return(`Masuk list_task_tgl`);
        },

        reformat_tanggal(tanggal) {
            var dd = tanggal.slice(0,2);
            var mm = tanggal.slice(3,5);
            var yyyy = tanggal.slice(6,10);

            return (yyyy + '-' + mm + '-' + dd);
        },

        //Intent 3 - Menampilkan deadline tugas
        //Komposisi: jenis (deadline) -> semua task, ?
        list_task_kd() {
            let kode = this.read_kode[0].toUpperCase();

            if (this.read_jenis[0] === "Deadline") {
                this.getTaskByKodeMatkul(kode)
                        .then(res => this.tasksFormatter(res))
                        .then(res => this.messages.push({
                        text: res,
                        author: "silobot"
                        }))
            } else {
                this.getTaskByTypeAndKodeMatkul(this.read_jenis[0], kode)
                        .then(res => this.tasksFormatter(res))
                        .then(res => this.messages.push({
                        text: res,
                        author: "silobot"
                        }))
            }
            
        },

        list_task_jenis() {
            let jenis = this.read_jenis[0][0].toUpperCase() + this.read_jenis[0].slice(1);
            this.getTaskByJenis(jenis)
                        .then(res => this.tasksFormatter(res))
                        .then(res => this.messages.push({
                        text: res,
                        author: "silobot"
                        }))
        },

        list_all_task() {
            this.fetchAllTask()
                        .then(res => this.tasksFormatter(res))
                        .then(res => this.messages.push({
                        text: res,
                        author: "silobot"
                    }) )
        },


        //Intent 4 - Memperbaharui tanggal deadline
        //Komposisi: notask, diundur|diubah
        update_task() {
            console.log(this.read_tgl.length - 1);
            let tgl_new = this.reformat_tanggal(this.read_tgl[this.read_tgl.length - 1]);
            let no_task = this.read_taskmod[1];

            //query update di database
            this.updateTaskDeadline(no_task, tgl_new)
                .then(res => console.log(res));

        },


        //Intent 5 - Menyelesaikan tugas
        //Kompoksisi: notask, selesai
        finish_task() {
            console.log(this.read_taskdone);
            let no_task = this.read_taskdone[1];

            //query delete task dari database
            this.markTaskDone(no_task)
                .then(res => console.log(res));
            
            

            //DEBUG
        },

        sendMessage(){
            if(this.message!=""){
                this.messages.push({
                    text: this.message,
                    author: "client"
                })

                var answer;

                this.read_jenis = this.findKataPenting(this.message);
                // this.read_jenis = this.message.match(this.re_jenis);
                this.read_kode = this.message.match(this.re_kode);
                this.read_topik = this.regex_topik(this.message);
                this.read_tgl = this.regex_date(this.message);
                this.read_taskdone = this.message.match(this.re_taskdone);
                this.read_taskmod = this.message.match(this.re_taskmod);
                this.read_q = this.message.match(this.re_q);
                this.read_help = this.message.match(this.re_help);
                

                console.log(this.read_jenis);
                console.log(this.read_kode);
                console.log(this.read_topik);
                console.log(this.read_tgl);
                console.log(this.read_taskdone);
                console.log(this.read_taskmod);
                console.log(this.read_q);
                console.log(this.read_help);

                //DEBUG
                console.log("Current DEBUG: " + this.read_tgl);

                var newDate = new Date();
                console.log(newDate.setDate(new Date().getDate()));
                var dd = String(newDate.getDate()).padStart(2, '0');
                var mm = String(newDate.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = newDate.getFullYear();
            
                var result = dd + '/' + mm + '/' + yyyy;
                console.log(result);
                this.assistantManager();


            }
            this.message = ""
        },
        //INTENT MANAGER
        assistantManager(){
            if (this.read_taskmod !== null && this.read_tgl !== null) {
                return(this.update_task());

            } else if (this.read_taskdone !== null) {
                return(this.finish_task());

            } else if (this.read_jenis !== null && this.read_kode !== null &&
                this.read_tgl !== null && this.read_topik !== null &&
                this.read_q === null) {
                    this.add_task();

            } else if (this.read_jenis !== null &&
                this.read_tgl !== null && this.read_kode === null) {
                    this.list_task_tgl();

            } else if (
                this.read_tgl === null && this.read_kode !== null) {
                    this.list_task_kd();

            } else if (this.read_jenis !== null &&
                this.read_tgl === null && this.read_kode === null) {
                    console.log(this.read_jenis);
                    if (this.read_jenis[0] === 'Deadline') {
                        this.list_all_task();
                    } else {
                        this.list_task_jenis();
                    }
                    
            } else if (this.read_help !== null) {
                this.messages.push({
                text: this.getHelpMessage(),
                author: "silobot"
                })
            } else {
                this.messages.push({
                text: "Maaf, aku nggak ngerti",
                author: "silobot"
                })
            }
        },

        scrollToEnd(){
            var container = document.getElementById("chatbox");
            container.scrollTop = container.scrollHeight;
        },

        getHelpMessage(){
            var res = 
            `[Fitur]
            1. Menambahkan task baru
            2. Melihat daftar task yang harus dikerjakan
            3. Menampilkan deadline dari suatu task tertentu
            4. Memperbaharui task tertentu
            5. Menandai bahwa suatu task sudah selesai dikerjakan
            
            [Daftar Kata Penting]
            1. Kuis
            2. Ujian
            3. Tucil
            4. Tubes
            5. Praktikum
            6. Tugas
            7. Deadline
            `;
            return res;
        },
        tasksFormatter(tasks){
            if(tasks.length==0){
                var result = `Tidak Ada`
            }else{
                var result = `[Daftar Deadline]
                `
                tasks.forEach((element, index) => {
                    var d = new Date(element.deadline)
                    var dd = String(d.getDate()).padStart(2, '0')
                    var dm = String(d.getMonth()+1).padStart(2, '0')
                    var dy = d.getFullYear()
                    result += `${index+1}. (ID:${element.id}) ${dd}/${dm}/${dy} - ${element.kodeMatkul} - ${element.taskType} - ${element.taskTopic}
                    `
                });
            }

            return result;
        },
        taskFormatter(task){
            var result = `[Daftar Deadline]
            `
            var d = new Date(task.deadline)
            var dd = String(d.getDate()).padStart(2, '0')
            var dm = String(d.getMonth()+1).padStart(2, '0')
            var dy = d.getFullYear()
            result += `1. (ID:${task.id}) ${dd}/${dm}/${dy} - ${task.kodeMatkul} - ${task.taskType} - ${task.taskTopic}
            `
            return result;
        },
        async fetchAllTask() {
            try{
                let task = await this.$axios.$get('https://silobot-api.herokuapp.com/tasks')
                return task
            }catch(err){
                console.log(err);
            }
        },
        async getTaskById(id) {
            try{
                let url = `https://silobot-api.herokuapp.com/tasks/id/${id}`
                let task = await this.$axios.$get(url)
                return task
            }catch(err){
                console.log(err);
            }
        },
        async getTaskByTimePeriod(time1, time2){
            try{
                let task = await this.$axios.$request({
                method: 'POST',
                url: `https://silobot-api.herokuapp.com/tasks/time`,
                headers: {
                },
                data: {
                    startDate: time1,
                    endDate: time2
                }
                })
                return task
            }catch(err){
                console.log(err)
            }
        },
        async getTaskByJenis(type){
            try{
                let task = await this.$axios.$request({
                method: 'POST',
                url: `https://silobot-api.herokuapp.com/tasks/type`,
                headers: {
                },
                data: {
                    taskType: type
                }
                })
                return task
            }catch(err){
                console.log(err)
            }
        },
        async getTaskByTimeAndType(type, time1, time2){
            try{
                let task = await this.$axios.$request({
                method: 'POST',
                url: `https://silobot-api.herokuapp.com/tasks/typetime`,
                headers: {
                },
                data: {
                    taskType: type,
                    startDate: time1,
                    endDate: time2
                }
                })
                return task
            }catch(err){
                console.log(err)
            }
        }, 
        async getTugasByDeadline(time){
            try{
                let task = await this.$axios.$request({
                method: 'POST',
                url: `https://silobot-api.herokuapp.com/tasks/time/tugas`,
                headers: {
                },
                data: {
                    deadline: time
                }
                })
                return task
            }catch(err){
                console.log(err)
            }
        }, async getTaskByKodeMatkul(kode){
            try{
                let task = await this.$axios.$request({
                method: 'POST',
                url: `https://silobot-api.herokuapp.com/tasks/kodematkul`,
                headers: {
                },
                data: {
                    kodeMatkul: kode
                }
                })
                return task
            }catch(err){
                console.log(err)
            }
        },async getTaskByTypeAndKodeMatkul(type,kode){
            try{
                let task = await this.$axios.$request({
                method: 'POST',
                url: `https://silobot-api.herokuapp.com/tasks/typekodematkul`,
                headers: {
                },
                data: {
                    taskType: type,
                    kodeMatkul: kode
                }
                })
                return task
            }catch(err){
                console.log(err)
            }
        },
        async createNewTask(deadline, kode, type, topic){
            try{
                let task = await this.$axios.$request({
                method: 'POST',
                url: `https://silobot-api.herokuapp.com/tasks/new`,
                headers: {
                },
                data: {
                    deadline: deadline,
                    kodeMatkul: kode,
                    taskType: type,
                    taskTopic: topic
                }
                })
                return task
            }catch(err){
                console.log(err)
            }
        },
        async updateTaskDeadline(id, deadline){
            try{
                let task = await this.$axios.$request({
                method: 'PATCH',
                url: `https://silobot-api.herokuapp.com/tasks/id/${id}`,
                headers: {
                },
                data: {
                    newDeadline: deadline
                }
                })
                console.log("sini: "+ task.message);
                if (task.message === "Failed!") {
                    this.messages.push({
                        text: `Task tidak ditemukan!`,
                        author: "silobot"
                        })
                    return;
                }
                this.messages.push({
                    text: `Task berhasil diupdate!`,
                    author: "silobot"
                    })
                return task
            }catch(err){
                console.log(err)
            }
        },
        async markTaskDone(id){
            try{
                let task = await this.$axios.$request({
                method: 'PATCH',
                url: `https://silobot-api.herokuapp.com/tasks/id/${id}/done`,
                headers: {
                },
                data: {
                }
                })
                console.log("sini: "+ task.message);
                if (task.message === "Failed!") {
                    this.messages.push({
                    text: `Task tidak ditemukan!`,
                    author: "silobot"
                    })
                    return;
                }
                this.messages.push({
                    text: `Selamat telah menyelesaikan task!`,
                    author: "silobot"
                    })
                return task
            }catch(err){
                console.log(err)
            }
        },
    },
    mounted(){
        this.scrollToEnd();
    },
    updated(){
        this.scrollToEnd();
    }

}
</script>

<style lang="scss" scoped>
.page-content{
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
}
.chat-box-list{
    display: flex;
    flex-direction: column;
    list-style-type: none;
    justify-content: center;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    .client{
        align-self: flex-end;
        vertical-align: top;
        background: #a6f6f1;
        border-radius: 4px;
        line-height: 1.4;
        max-width: 80%;
        padding: 5px;
        color: #213e3b;
        margin-bottom: 10px;
        p{
            margin-bottom: 10px;
            margin-top: 10px;
            white-space: pre-line;
            word-break: normal;
        }
    }
    
    .silobot{
        align-self: flex-start;
        vertical-align: top;
        background: #41aea9;
        border-radius: 4px;
        line-height: 1.5;
        max-width: 80%;
        padding: 5px;
        color: #e8ffff;
        margin-bottom: 10px;
        p{
            margin-bottom: 10px;
            margin-top: 10px;
            white-space: pre-line;
            word-break: normal;
        }
    }
}

.chat-box{
    border: 1px solid #999;
    border-radius: 4px;
    width: 50%;
    height: 85vh;
    display: flex   ;
    flex-direction: column;
    justify-content: space-between;
    align-content: space-between;
    margin-top: 10px;
    background-color: #e8ffff;
    margin-right: 0;
}

.chat-box-list-container{
    overflow-y: scroll;
    overflow-x: hidden;
}

.chat-inputs{
    display: flex;
    flex-direction: row;
    align-items: space-between;
    height: 40px;

    input{
        line-height: 3;
        width: 100%;
        border: 1px solid #999;
        border-left: none;
        border-right: none;
        border-bottom: none;
        border-bottom-left-radius: 4px;
        padding-left: 15px;
    }
    
    button{
        width: 145px;
        color: #e8ffff;
        background-color:#213e3b;
        border-bottom-right-radius: 4px;
        padding: 0;
        border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
    }

}
</style>

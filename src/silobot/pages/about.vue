<template>
    <div class="page-content">
        <div v-if="showProfile" class="profil">
            <div class="aboutmenu">
                <button class="selected" @click="showProfile = true">
                    Silobot Profile
                </button>
                <button class="notSelected" @click="showProfile = false">
                    Silobot Team
                </button>
            </div>
            <div class="profile">
                <b-card img-src="Logo-1.png" img-alt="Card image" img-left class="mb-3">
                <b-card-text>
                    Silobot adalah sebuah Deadline Reminder Assistant yang diimplementasikan dalam chatbot sederhana yang berfungsi untuk
                    membantu mengingatkan berbagai deadline, tanggal penting, dan task-task tertentu kepada user yang menggunakannya.
                    Silobot dibangun dengan memanfaatkan algoritma String Matching dan Regular Expression untuk mengenali dan menjawab
                    segala pertanyaan user terkait informasi deadline task-task yang ada. <br><br>
                    Fitur-Fitur yang dapat dilakukan oleh Silobot antara lain : <br>
                    1. Menambahkan task baru <br>
                    2. Melihat daftar task yang harus dikerjakan<br>
                    3. Menampilkan deadline dari suatu task tertentu<br>
                    4. Memperbaharui task tertentu<br>
                    5. Menandai bahwa suatu task sudah selesai dikerjakan<br><br>
                    Fitur ini dapat digunakan jika pesan yang dikirim user mengandung kata penting seperti Kuis, Ujian, Tucil, Tubes, Praktikum, Tugas, dan Deadline.
                </b-card-text>
                </b-card>
            </div>
        </div>
        <div v-if="!showProfile" class="suratsuara">
            <div class="aboutmenu">
                <button class="notSelected" @click="showProfile = true">
                    Silobot Profile
                </button>
                <button class="selected" @click="showProfile = false">
                    Silobot Team
                </button>
            </div>
            <div class="team">
                <b-card-group deck>
                    <b-card title="Gde Anantha" img-src="anantha.png" img-alt="Image" img-top>
                        <b-card-text>
                            13519026
                        </b-card-text>
                        <template #footer>
                            <small class="text-muted">Frontend Developer</small>
                        </template>
                    </b-card>

                    <b-card title="Shifa Salsabiila" img-src="shifa.png" img-alt="Image" img-top>
                        <b-card-text>
                            13519106
                        </b-card-text>
                        <template #footer>
                            <small class="text-muted">Algorithm Master</small>
                        </template>
                    </b-card>

                    <b-card title="Andres Jerriel" img-src="andres.png" img-alt="Image" img-top>
                        <b-card-text>
                            13519218
                        </b-card-text>
                        <template #footer>
                            <small class="text-muted">Backend Developer</small>
                        </template>
                    </b-card>
                </b-card-group>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : "about",
    data: () => ({
        showProfile: true,
    })
}
</script>

<style lang="scss" scoped>
.page-content{
    display:flex;
    flex-direction: column;
    justify-content: flex-start;
}

.aboutmenu {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  font-family: Poppins, sans-serif;

  button {
    padding: 5px 10px;
    color: black;
    border: 2px solid #a6f6f1;
    background: #a6f6f1;
    border-radius: 20px;
    letter-spacing: 2px;
    transition: 0.2s ease-out;
    margin: 0 10px 30px;
    outline: none;
  }
  .notSelected {
    background: transparent;
    color: #a6f6f1;
  }
  .notSelected:hover {
    background: #a6f6f1;
    color: black;
  }
}

.card-deck{
    margin-left:0;
    margin-right:0;
    margin-bottom:20px;
}
.card{
    background-color: #e8ffff;
}
.card-text{
    height: 15px;
    text-align: justify;
}
.card-img-left{
    background-color: #213e3b;
    border:0;
    max-height: 410px;
}
.profile{
    max-width: 80%;
    margin: auto;
}
</style>

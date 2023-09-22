import React, { useState } from "react";
import styled from "./Art.module.css";
import album_api from "./api/api";

function Art() {
    const [pesquisa, set_pesquisa] = useState("");
    const [albuns, set_albuns] = useState([]);
    const [erro, set_erro] = useState("");
    const [modoPesquisa, setModoPesquisa] = useState("artista");
    const api = "0274eb5bcb76d317549705819fe1aaf7";

    async function consultar() {
        try {
            let response;
            if (modoPesquisa === "artista") {
                response = await album_api.get(
                    `?method=artist.gettopalbums&artist=${pesquisa}&api_key=${api}&format=json`
                );
            } else if (modoPesquisa === "album") {
                response = await album_api.get(
                    `?method=album.search&album=${pesquisa}&api_key=${api}&format=json`
                );
            } else if (modoPesquisa === "melhores_albums") {
                response = await album_api.get(
                    `?method=artist.gettopalbums&artist=${pesquisa}&api_key=${api}&format=json`
                );
            }
            else if (modoPesquisa === "artistas_semelhantes") {
                response = await album_api.get(
                    `?method=artist.getsimilar&artist=${pesquisa}&api_key=${api}&format=json`
                );
            } else if (modoPesquisa === "faixa") {
                response = await album_api.get(
                    `?method=track.search&track=${pesquisa}&api_key=${api}&format=json`
                );
            }

            if (response.data) {
                const data = response.data;

                if (modoPesquisa === "artista" && data.topalbums && data.topalbums.album.length > 0) {
                    const albums_data = data.topalbums.album;
                    const capas = albums_data
                        .map((album) => album.image[2]["#text"])
                        .filter((value, index, self) => self.indexOf(value) === index)
                        .slice(0, 32);
                    set_albuns(capas);
                    set_erro("");
                } else if (modoPesquisa === "album" && data.results.albummatches.album.length > 0) {
                    const albums_data = data.results.albummatches.album;
                    const capas = albums_data
                        .map((album) => album.image[2]["#text"])
                        .filter((value, index, self) => self.indexOf(value) === index)
                        .slice(0, 32);
                    set_albuns(capas);
                    set_erro("");
                } else if (modoPesquisa === "melhores_albums" && data.topalbums && data.topalbums.album.length > 0) {
                    const albums_data = data.topalbums.album;
                    const capas = albums_data
                        .map((album) => album.image[2]["#text"])
                        .filter((value, index, self) => self.indexOf(value) === index)
                        .slice(0, 32);
                    set_albuns(capas);
                    set_erro("");
                } else if (modoPesquisa === "artistas_semelhantes" && data.similarartists.artist.length > 0) {
                    const albums_data = data.similarartists.artist;
                    const capas = albums_data
                        .map((artista) => artista.image[2]["#text"])
                        .filter((value, index, self) => self.indexOf(value) === index)
                        .slice(0, 32);
                    set_albuns(capas);
                    set_erro("");
                } else if (modoPesquisa === "faixa" && data.results.trackmatches.track.length > 0) {
                    const faixas_data = data.results.trackmatches.track;
                    const capas = faixas_data
                        .map((faixa) => faixa.image[2]["#text"])
                        .filter((value, index, self) => self.indexOf(value) === index)
                        .slice(0, 32);
                    set_albuns(capas);
                    set_erro("");
                } else {
                    set_albuns([]);
                    set_erro(
                        modoPesquisa === "artista"
                            ? "Nenhum álbum encontrado para o artista informado."
                            : modoPesquisa === "album"
                            ? "Nenhum álbum encontrado com esse nome."
                            : modoPesquisa === "artistas_semelhantes"
                            ? "Nenhum artista semelhante foi encontrado"
                            : modoPesquisa === "faixa"
                            ? "Nenhuma faixa encontrada com esse nome."
                            : "Nenhum álbum encontrado como os melhores artistas"
                    );
                }
            } else {
                set_albuns([]);
                set_erro("Nenhum resultado encontrado. Verifique os dados digitados ou tente novamente");
            }
        } catch (error) {
            console.error("Erro ao obter dados do servidor:", error.message);
            set_albuns([]);
            set_erro(
                "Ocorreu um erro ao buscar os dados. Verifique os valores digitados ou tente novamente"
            );
        }
    }

    return (
        <div>
            <div className={styled.header}>Buscar Álbuns</div>
            <div className={styled.main}>
                <div className={styled.searchBar}>
                    <select
                        value={modoPesquisa}
                        onChange={(e) => setModoPesquisa(e.target.value)}
                    >
                        <option value="artista">Artista</option>
                        <option value="album">Álbum</option>
                        <option value="melhores_albums">Melhores Álbuns</option>
                        <option value="artistas_semelhantes">Artistas Semelhantes</option>
                        <option value="faixa">Nome da Faixa</option> 
                    </select>
                    <input
                        type="text"
                        onChange={(e) => set_pesquisa(e.target.value)}
                        placeholder={`Pesquisar por ${
                            modoPesquisa === "artista"
                                ? "Nome do Artista"
                                : modoPesquisa === "album"
                                ? "Nome do Álbum"
                                : modoPesquisa === "faixa" 
                                ? "Nome da Faixa"
                                : "Nome do Artista"
                        }`}
                    />
                    <button type="button" onClick={consultar}>
                        Pesquisar
                    </button>
                </div>
                <div className={styled.erro}>{erro && <p>{erro}</p>}</div>
                <div className={styled.albuns}>
                    {albuns.map((capa, index) =>
                        capa ? (
                            <div className={styled.capa} key={index}>
                                <img src={capa} alt={`Album ${index}`} />
                            </div>
                        ) : null
                    )}
                </div>
            </div>
        </div>
    );
}

export default Art;


import React, {Component} from "react";
import BackendService from "../services/BackendService";
import {faEdit, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Alert from "./Alert";
import PaginationComponent from "./PaginationComponent";

class CountryListComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: undefined, // текст в окне Alert
            countries: [],
            selected_countries: [], //список отмеченных для удаления стран
            show_alert: false, //флаг отображения модального окна Alert для подтверждения удалени стран.
            checkedItems: [],//чек бокс для удаления
            hidden: false,// логический флаг для запрета отображения списка стран в случае, если запрос к сервису завершился с ошибкой
            page: 1,
            limit: 2,
            totalCount: 0,
        }

        this.refreshCountries = this.refreshCountries.bind(this)
        this.updateCountryClicked = this.updateCountryClicked.bind(this)
        this.addCountryClicked = this.addCountryClicked.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deleteCountriesClicked = this.deleteCountriesClicked.bind(this)
        this.onPageChanged = this.onPageChanged.bind(this)
    }

    onPageChanged(cp) {
        this.refreshCountries( cp - 1 );
    }

    setChecked(v) { //отмечает или снимает отметку всех чек боксов
        let checkedCopy = Array(this.state.countries.length).fill(v);
        this.setState({checkedItems: checkedCopy});
    }

    handleCheckChange(e) { //При изменении состояния чек бокса
        const idx = e.target.name;
        const isChecked = e.target.checked;

        let checkedCopy = [...this.state.checkedItems];
        checkedCopy[idx] = isChecked;
        this.setState({checkedItems: checkedCopy});
    }

    handleGroupCheckChange(e) {//это обработчик чек бокса в заголовке таблицы. устанавливает или сбрасывает все чек боксы в строках таблицы.
        const isChecked = e.target.checked;
        this.setChecked(isChecked);
    }

    deleteCountriesClicked() {
        let x = [];
        this.state.countries.map((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0
        });
        if (x.length > 0) {
            let msg;
            if (x.length > 1) {
                msg = "Пожалуйста подтвердите удаление " + x.length + "стран";
            } else {
                msg = "Пожалуйста подтвердите удаление страны " + x[0].name;
            }
            this.setState({show_alert: true, selected_countries: x, message: msg});
        }
    }

    onDelete() {//после нажатия ок
        BackendService.deleteCountries(this.state.selected_countries)
            .then(() => this.refreshCountries(this.state.page))
            .catch(() => {
            });
    }

    //. По кнопке Cancel и ок вызывается
    closeAlert() {
        this.setState({show_alert: false})
    }


    refreshCountries() {
        BackendService.retrieveAllCountries()
            .then(resp => {
                this.setState({
                    countries: resp.data,  hidden: false });
            })
            .catch(() => {
                this.setState({ hidden: true})
            })
            .finally(() => this.setChecked(false))
    }

    componentDidMount() { //загружаются данные, необходимые для  прорисовки
        this.refreshCountries(0);
    }

    updateCountryClicked(id) {//обработчик кнопки для перехода к странице редактирования страны
        this.props.history.push(`/countries/${id}`)
    }

    addCountryClicked() {//Для добавления страны
        this.props.history.push(`/countries/-1`);
    }

    render() {
        if (this.state.hidden)//возвращаем null ничего не рисуя.
            return null;
        return (//Иначе выводим заголовок и две кнопки для добавления страны и удаления стран.
            <div className="m-4">
                <div className=" row my-2 mr-0">
                    <h3>Страны</h3>
                    <button className="btn btn-outline-secondary ml-auto"
                            onClick={this.addCountryClicked}><FontAwesomeIcon icon={faPlus}/>{' '}Добавить
                    </button>
                    <button className="btn btn-outline-secondary ml-2"
                            onClick={this.deleteCountriesClicked}><FontAwesomeIcon icon={faTrash}/>{' '}Удалить
                    </button>
                </div>
                <div className="row my-2 mr-0">
                    <PaginationComponent
                        totalRecords={this.state.totalCount}
                        pageLimit={this.state.limit}
                        pageNeighbours={1}
                        onPageChanged={this.onPageChanged}
                    />
                    <table className="table table-sm">
                        <thead className="thead-light">
                        <tr>
                            <th>Название</th>
                            <th>
                                <div className="btn-toolbar pb-1">
                                    <div className="btn-group ml-auto">
                                        <input type="checkbox" onChange={this.handleGroupCheckChange}/>
                                    </div>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.countries && this.state.countries.map((country, index) =>
                                <tr key={country.id}>
                                    <td>{country.name}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm-btn-toolbar"
                                                        onClick={() => this.updateCountryClicked(country.id)}>
                                                    <FontAwesomeIcon icon={faEdit} fixedWidth/></button>
                                            </div>
                                            <div className="btn-group ml-2 mt-1">
                                                <input type="checkbox" name={index}
                                                       checked={this.state.checkedItems.length > index ? this.state.checkedItems[index] : false}
                                                       onChange={this.handleCheckChange}/>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }

                        </tbody>
                    </table>
                </div>
                <Alert
                    title='Удаление'
                    message={this.state.message}
                    ok={this.onDelete}
                    close={this.closeAlert}
                    modal={this.state.show_alert}
                    cancelButton={true}
                />
            </div>
        )
    }
}

export default CountryListComponent;


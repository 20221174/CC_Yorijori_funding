const db = require("../models/index"),
    FundingProduct = db.fundingProduct,
    FundingGroup = db.fundingGroup,
    User = db.user,
    Composition = db.composition,
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;

getJuso = group => { //주소합치기
    let juso = `${group.city} ${group.district} ${group.town} ${group.detail}`;
    return juso;
};
module.exports = {
    fundingList: async (req, res, next) => {
        try {
            //findAll()로 했더니 원하는 결과가 안나와서 raw 쿼리 사용함. 펀딩그룹을 기준으로 펀딩상품과 유저 테이블을 조인해서 정보가져옴.
            let userId = res.locals.currentUser.getDataValue('userId');
            let query = `
                                 SELECT 
                                        fundingGroups.fundingGroupId,
                                        fundingProducts.productName,
                                        fundingProducts.unitPrice,
                                        fundingProducts.quantity,    
                                        fundingProducts.unit,
                                        users.name,
                                        fundingGroups.district,
                                        fundingProducts.imageUrl
                                    FROM
                                        fundingGroups
                                    LEFT JOIN
                                        fundingProducts ON fundingGroups.fundingProductId = fundingProducts.fundingProductId
                                    LEFT JOIN
                                        users ON fundingGroups.representativeUserId = users.userId
                                    WHERE fundingGroups.district = (select fundingGroups.district
                                        from fundingGroups
                                        left join  users On fundingGroups.district = users.district
                                        where users.userId = ${userId}
                                        LIMIT 1) AND fundingGroups.people != (SELECT COUNT(*)
                                                    FROM compositions
                                                    WHERE compositions.fundingGroupId = fundingGroups.fundingGroupId);`
                            //배부장소와 구매자의 주소가 일치
                            //펀딩인원이 다 차면 목록에 나오지않게
            let products = await sequelize.query(query, { type: Sequelize.SELECT });
            res.locals.products = products;
            next();
        } catch (error) {
            res.status(500).send({ message: error.message });
            console.error(`Error: ${error.message}`);
        }
    },
    getFundingPage: async (req, res) => { //펀딩그룹모집중인 목록 보여주는 처음페이지
        let products = res.locals.products;
        res.render('funding/fundingPage', { products: products[0], messages: req.flash('info') }); //products안에 동일한 객체 2개가 배열로 이루어져있어서 첫번째 객체만 출력하게함.

    },
    fundingSearch: async (req, res, next) => {
        try {
            let userId = res.locals.currentUser.getDataValue('userId');
            let query = req.query.query;
            let sql = `SELECT fundingGroups.fundingGroupId,
                            fundingProducts.productName,
                            fundingProducts.unitPrice,
                            fundingProducts.quantity,
                            fundingProducts.unit,
                            users.name,
                            users.district,
                            fundingProducts.imageUrl
                        FROM
                            fundingGroups
                        LEFT JOIN
                            fundingProducts ON fundingGroups.fundingProductId = fundingProducts.fundingProductId
                        LEFT JOIN
                            users ON fundingGroups.representativeUserId = users.userId
                        WHERE fundingGroups.district = (select fundingGroups.district
                            from fundingGroups
                            left join  users On fundingGroups.district = users.district
                            where users.userId = ${userId}
                            LIMIT 1) AND fundingGroups.people != (SELECT COUNT(*)
                            FROM compositions
                            WHERE compositions.fundingGroupId = fundingGroups.fundingGroupId) AND productName LIKE ?`;
                            //배부장소와 구매자의 주소가 일치
                            //펀딩인원이 다 차면 목록에 나오지않게
            let values
            if (!query) { //검색창에 아무것도 입력하지 않았을 때
                res.redirect('/joinfundingPage/fundingPage');
                return;
            }
            else { //키워드를 입력했을 때
                values = [`%${query}%`]; //WHERE productName LIKE ? 부분에 바인딩
            }

            let [results, metadata] = await sequelize.query(sql, {
                replacements: values,
                type: Sequelize.SELECT
            });
            res.locals.results = results;
            res.locals.query = query;
            next();

        } catch (error) {
            res.status(500).send({ message: error.message });
            console.error(`Error: ${error.message}`);
        }
    },
    getFundingSearch: async (req, res) => {
        res.render("funding/fundingSearch", { results: res.locals.results, query: res.locals.query });
    },
    joinFunding: async (req, res, next) => {
        try {
            let groupId = req.params.groupId; //펀딩그룹 ID가져옴
            // let group = await FundingGroup.findOne({ where: { fundingGroupId: GroupId } });
            let query = `SELECT  
                                fundingProducts.productName,
                                fundingProducts.quantity,
                                fundingProducts.unitPrice,
                                DATE_FORMAT(fundingGroups.deliveryDate, '%Y.%m.%d') AS deliveryDate,
                                DATE_FORMAT(fundingGroups.fundingDate, '%Y.%m.%d') AS fundingDate,
                                users.name,
                                fundingGroups.city,
                                fundingGroups.district,
                                fundingGroups.town,
                                fundingGroups.detail,
                                DATE_FORMAT(fundingGroups.distributionDate, '%Y년 %m월 %d일 %p %I:%i') AS distributionDate,
                                fundingGroups.people,      
                                fundingProducts.unit,
                                fundingGroups.fundingGroupId,
                                fundingGroups.deliveryCost,
                                fundingProducts.imageUrl
                            FROM
                                fundingGroups
                            LEFT JOIN
                                fundingProducts ON fundingGroups.fundingProductId = fundingProducts.fundingProductId
                            LEFT JOIN
                                users ON fundingGroups.representativeUserId = users.userId
                            WHERE fundingGroups.fundingGroupId = ${groupId};`
            let result = await sequelize.query(query, { type: Sequelize.SELECT });
            res.locals.group = result[0]; //result에 [[{키:값}],[{키:값}]]형태로 동일한 객체가 두개 존재해서 첫번째[{}]만 추출.
        
            let price = res.locals.group[0].unitPrice + (res.locals.group[0].deliveryCost / (res.locals.group[0].people - 1)); //결제금액 계산
            res.locals.price = price;
            next();
        } catch (error) {
            res.status(500).send({ message: error.message });
            console.error(`Error: ${error.message}`);
        }
    },
    getJoinFunding: async (req, res) => { //참여할 펀딩선택했을때 선택한 펀딩에 대한 정보 보여주기
        let groups = res.locals.group[0];
        let juso = getJuso(groups);
        //펀딩에 참여한 인원 추출
        let query = `                        
                    select count(fundingGroupId) as c
                    from compositions
                    where fundingGroupId = ${groups.fundingGroupId}; 
                    `
        let [results, metadata] = await sequelize.query(query, { type: Sequelize.SELECT });
        let people = groups.people - results[0].c - 1;//전체펀딩인원 - 펀딩참여인원 - 펀딩대표 = 남은 인원
        res.render("funding/joinFunding", { group: groups, juso: juso, people: people });//res.locals.group에 [{키:값}]형태로 있어서 인덱스로 첫번째 객체 가져옴.
    },
    getJoinFundingClick: async (req, res) => { //펀딩 참여눌렀을 때 확인페이지
        try {
            let userId = res.locals.currentUser.getDataValue('userId');
            let groups = res.locals.group[0];
            let juso = getJuso(groups);
            let query = `SELECT
                        users.userId,  
                         users.name,
                         users.phoneNumber
                    FROM
                        users
                    WHERE users.userId = ${userId};` 
            let result = await sequelize.query(query, { type: Sequelize.SELECT });
            res.locals.user = result[0];
            let user = res.locals.user[0];
            let price = res.locals.price;

            let composition = await Composition.findOne({ //이미 참여한 펀딩인지 확인하기 위해
                where: {
                    fundingGroupId: groups.fundingGroupId,
                    userId: user.userId
                }
            });
            if (composition) {
                //처음 펀딩목록화면으로 이동 후 플레시메시지

                console.log("참여한펀딩");
                req.flash('info', '이미 참여한 펀딩입니다.')
                res.redirect('/joinfundingPage/fundingPage');
            }else{
            res.render("funding/joinFundingClick", { user: user, group: groups, juso: juso, price: price });
            }
        } catch (error) {
            res.status(500).send({ message: error.message });
            console.error(`Error: ${error.message}`);
        }
    },
    joinRequest: async (req, res, next) => {

        let groups = res.locals.group[0];
        let groupId = req.params.groupId
       
                let userId = res.locals.currentUser.getDataValue('userId');
                let price = res.locals.price;
                let newComposition = await Composition.create({ //펀딩참여시 composition테이블에 추가
                    fundingGroupId: groupId,
                    userId: userId, 
                    quantity: groups.unit,
                    amount: price
                });
                next();
    },
    getJoinFundingComplete: async (req, res) => { //참여완료하고 알림?정보 보여주는 페이지
        res.render("funding/joinFundingComplete", { group: res.locals.group[0] });
    },
    cancleFunding: async (req, res) => { //마이페이지에서 참여한 펀딩 취소
        let groupId = req.params.groupId;
        let userId = res.locals.currentUser.getDataValue('userId');
        let query = `
                    DELETE FROM compositions
                    WHERE userId = ${userId} and fundingGroupId = ${groupId};` 
        let result = await sequelize.query(query, { type: Sequelize.DELETE });
        res.redirect("/auth/mypageParticipatedFunding");

    }

}